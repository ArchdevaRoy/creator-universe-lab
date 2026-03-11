
-- Drop the security definer view and recreate as invoker
DROP VIEW IF EXISTS public.creator_karma;

CREATE OR REPLACE VIEW public.creator_karma
WITH (security_invoker = true)
AS
  SELECT 
    li.creator_id,
    COALESCE(SUM(ke.points), 0)::INTEGER AS total_karma,
    COUNT(DISTINCT ke.id)::INTEGER AS total_events
  FROM public.library_items li
  LEFT JOIN public.karma_events ke ON ke.item_id = li.id
  GROUP BY li.creator_id;
