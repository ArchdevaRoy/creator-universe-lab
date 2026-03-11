
-- Content type enum
CREATE TYPE public.library_content_type AS ENUM ('audio', 'video');

-- Music genres
CREATE TYPE public.music_genre AS ENUM (
  'hip-hop', 'electronic', 'r-and-b', 'rock', 'lo-fi', 'jazz', 'classical', 'pop', 'ambient', 'metal', 'soul', 'reggae', 'country', 'latin', 'other'
);

-- Content categories
CREATE TYPE public.content_category AS ENUM (
  'tutorial', 'vlog', 'podcast', 'cinematic', 'asmr', 'documentary', 'music-video', 'short-film', 'behind-the-scenes', 'live-session', 'remix', 'original', 'other'
);

-- Library items table
CREATE TABLE public.library_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content_type library_content_type NOT NULL,
  genre music_genre NOT NULL DEFAULT 'other',
  category content_category NOT NULL DEFAULT 'other',
  file_url TEXT,
  thumbnail_url TEXT,
  duration_seconds INTEGER DEFAULT 0,
  karma_total INTEGER NOT NULL DEFAULT 0,
  play_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;

-- Anyone can view library items
CREATE POLICY "Library items are viewable by everyone"
  ON public.library_items FOR SELECT
  TO public
  USING (true);

-- Creators can insert their own items
CREATE POLICY "Creators can insert own library items"
  ON public.library_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

-- Creators can update their own items
CREATE POLICY "Creators can update own library items"
  ON public.library_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Creators can delete their own items
CREATE POLICY "Creators can delete own library items"
  ON public.library_items FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Karma events table (milestone-based)
CREATE TABLE public.karma_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES public.library_items(id) ON DELETE CASCADE NOT NULL,
  milestone INTEGER NOT NULL CHECK (milestone IN (25, 50, 100)),
  points INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_id, milestone)
);

ALTER TABLE public.karma_events ENABLE ROW LEVEL SECURITY;

-- Users can view their own karma events
CREATE POLICY "Users can view own karma events"
  ON public.karma_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert karma events
CREATE POLICY "Users can insert karma events"
  ON public.karma_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Creator karma leaderboard view
CREATE OR REPLACE VIEW public.creator_karma AS
  SELECT 
    li.creator_id,
    COALESCE(SUM(ke.points), 0) AS total_karma,
    COUNT(DISTINCT ke.id) AS total_events
  FROM public.library_items li
  LEFT JOIN public.karma_events ke ON ke.item_id = li.id
  GROUP BY li.creator_id;

-- Function to award karma and update item totals
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
  -- Determine points by milestone
  v_points := CASE p_milestone
    WHEN 25 THEN 5
    WHEN 50 THEN 10
    WHEN 100 THEN 25
    ELSE 0
  END;

  -- Get creator id
  SELECT creator_id INTO v_creator_id FROM public.library_items WHERE id = p_item_id;
  
  -- Don't award karma for own content
  IF v_creator_id = p_user_id THEN
    RETURN jsonb_build_object('awarded', false, 'reason', 'own_content');
  END IF;

  -- Insert karma event (unique constraint prevents duplicates)
  INSERT INTO public.karma_events (user_id, item_id, milestone, points)
  VALUES (p_user_id, p_item_id, p_milestone, v_points)
  ON CONFLICT (user_id, item_id, milestone) DO NOTHING;

  IF FOUND THEN
    -- Update item karma total
    UPDATE public.library_items
    SET karma_total = karma_total + v_points
    WHERE id = p_item_id;

    RETURN jsonb_build_object('awarded', true, 'points', v_points, 'milestone', p_milestone);
  ELSE
    RETURN jsonb_build_object('awarded', false, 'reason', 'already_awarded');
  END IF;
END;
$$;

-- Function to increment play count
CREATE OR REPLACE FUNCTION public.increment_play_count(p_item_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.library_items SET play_count = play_count + 1 WHERE id = p_item_id;
END;
$$;

-- Enable realtime for library items
ALTER PUBLICATION supabase_realtime ADD TABLE public.library_items;

-- Storage bucket for library media
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('library-media', 'library-media', true, 104857600);

-- Storage policies
CREATE POLICY "Anyone can view library media"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'library-media');

CREATE POLICY "Authenticated users can upload library media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'library-media');

CREATE POLICY "Users can update own library media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'library-media');

CREATE POLICY "Users can delete own library media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'library-media');
