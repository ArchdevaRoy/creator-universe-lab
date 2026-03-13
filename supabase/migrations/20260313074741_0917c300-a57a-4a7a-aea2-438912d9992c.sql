
-- Payout status enum
CREATE TYPE public.payout_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'rejected');

-- Wallets table - tracks creator karma balance
CREATE TABLE public.wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  karma_balance INTEGER NOT NULL DEFAULT 0,
  karma_lifetime INTEGER NOT NULL DEFAULT 0,
  total_paid_out NUMERIC(10,2) NOT NULL DEFAULT 0,
  stripe_account_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet"
  ON public.wallets FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallet"
  ON public.wallets FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet"
  ON public.wallets FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Payout requests table
CREATE TABLE public.payout_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  karma_amount INTEGER NOT NULL,
  cash_amount NUMERIC(10,2) NOT NULL,
  status payout_status NOT NULL DEFAULT 'pending',
  stripe_transfer_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payout requests"
  ON public.payout_requests FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payout requests"
  ON public.payout_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Wallet transaction log
CREATE TABLE public.wallet_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('karma_earned', 'payout_requested', 'payout_completed', 'payout_failed')),
  karma_amount INTEGER NOT NULL DEFAULT 0,
  cash_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  description TEXT,
  reference_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON public.wallet_transactions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON public.wallet_transactions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Update the award_karma function to also credit the creator's wallet
CREATE OR REPLACE FUNCTION public.award_karma(
  p_user_id UUID,
  p_item_id UUID,
  p_milestone INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_points INTEGER;
  v_creator_id UUID;
BEGIN
  v_points := CASE p_milestone
    WHEN 25 THEN 5
    WHEN 50 THEN 10
    WHEN 100 THEN 25
    ELSE 0
  END;

  SELECT creator_id INTO v_creator_id FROM public.library_items WHERE id = p_item_id;
  
  IF v_creator_id = p_user_id THEN
    RETURN jsonb_build_object('awarded', false, 'reason', 'own_content');
  END IF;

  INSERT INTO public.karma_events (user_id, item_id, milestone, points)
  VALUES (p_user_id, p_item_id, p_milestone, v_points)
  ON CONFLICT (user_id, item_id, milestone) DO NOTHING;

  IF FOUND THEN
    UPDATE public.library_items
    SET karma_total = karma_total + v_points
    WHERE id = p_item_id;

    -- Upsert wallet for creator and add karma
    INSERT INTO public.wallets (user_id, karma_balance, karma_lifetime)
    VALUES (v_creator_id, v_points, v_points)
    ON CONFLICT (user_id)
    DO UPDATE SET 
      karma_balance = wallets.karma_balance + v_points,
      karma_lifetime = wallets.karma_lifetime + v_points,
      updated_at = now();

    -- Log transaction
    INSERT INTO public.wallet_transactions (user_id, type, karma_amount, description, reference_id)
    VALUES (v_creator_id, 'karma_earned', v_points, 
      'Karma from ' || p_milestone || '% milestone on content', p_item_id);

    RETURN jsonb_build_object('awarded', true, 'points', v_points, 'milestone', p_milestone);
  ELSE
    RETURN jsonb_build_object('awarded', false, 'reason', 'already_awarded');
  END IF;
END;
$$;

-- Function to request a payout
CREATE OR REPLACE FUNCTION public.request_payout(
  p_user_id UUID,
  p_karma_amount INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_balance INTEGER;
  v_cash NUMERIC(10,2);
  v_payout_id UUID;
BEGIN
  -- Min 1000 karma (= $1)
  IF p_karma_amount < 1000 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Minimum payout is 1000 karma ($1.00)');
  END IF;

  SELECT karma_balance INTO v_balance FROM public.wallets WHERE user_id = p_user_id;
  
  IF v_balance IS NULL OR v_balance < p_karma_amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient karma balance');
  END IF;

  v_cash := p_karma_amount / 1000.0;

  -- Deduct from wallet
  UPDATE public.wallets 
  SET karma_balance = karma_balance - p_karma_amount, updated_at = now()
  WHERE user_id = p_user_id;

  -- Create payout request
  INSERT INTO public.payout_requests (user_id, karma_amount, cash_amount)
  VALUES (p_user_id, p_karma_amount, v_cash)
  RETURNING id INTO v_payout_id;

  -- Log transaction
  INSERT INTO public.wallet_transactions (user_id, type, karma_amount, cash_amount, description, reference_id)
  VALUES (p_user_id, 'payout_requested', -p_karma_amount, v_cash, 'Payout requested', v_payout_id);

  RETURN jsonb_build_object('success', true, 'payout_id', v_payout_id, 'cash_amount', v_cash);
END;
$$;

-- Leaderboard view
CREATE OR REPLACE VIEW public.karma_leaderboard
WITH (security_invoker = true)
AS
  SELECT 
    w.user_id,
    w.karma_lifetime,
    w.karma_balance,
    p.display_name,
    p.avatar_url
  FROM public.wallets w
  JOIN public.profiles p ON p.id = w.user_id
  ORDER BY w.karma_lifetime DESC
  LIMIT 50;

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.wallets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payout_requests;
