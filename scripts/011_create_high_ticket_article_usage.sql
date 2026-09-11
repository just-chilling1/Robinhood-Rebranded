-- Track which High-Ticket authority articles a member marked as used per offer link.
-- Run in the shared Supabase project (SQL Editor). Safe to run multiple times.

CREATE TABLE IF NOT EXISTS public.high_ticket_article_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  affiliate_link_id uuid REFERENCES public.affiliate_links(id) ON DELETE CASCADE,
  url_hash text,
  article_id integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT high_ticket_article_usage_link_xor CHECK (
    (affiliate_link_id IS NOT NULL AND url_hash IS NULL)
    OR (affiliate_link_id IS NULL AND url_hash IS NOT NULL)
  ),
  CONSTRAINT high_ticket_article_usage_url_hash_len CHECK (
    url_hash IS NULL OR length(url_hash) = 64
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS high_ticket_article_usage_vault_uidx
  ON public.high_ticket_article_usage (user_id, affiliate_link_id, article_id)
  WHERE affiliate_link_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS high_ticket_article_usage_url_uidx
  ON public.high_ticket_article_usage (user_id, url_hash, article_id)
  WHERE url_hash IS NOT NULL;

CREATE INDEX IF NOT EXISTS high_ticket_article_usage_user_vault_idx
  ON public.high_ticket_article_usage (user_id, affiliate_link_id)
  WHERE affiliate_link_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS high_ticket_article_usage_user_url_idx
  ON public.high_ticket_article_usage (user_id, url_hash)
  WHERE url_hash IS NOT NULL;

ALTER TABLE public.high_ticket_article_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own high ticket article usage" ON public.high_ticket_article_usage;
CREATE POLICY "Users can view own high ticket article usage"
  ON public.high_ticket_article_usage FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own high ticket article usage" ON public.high_ticket_article_usage;
CREATE POLICY "Users can insert own high ticket article usage"
  ON public.high_ticket_article_usage FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own high ticket article usage" ON public.high_ticket_article_usage;
CREATE POLICY "Users can delete own high ticket article usage"
  ON public.high_ticket_article_usage FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

GRANT SELECT, INSERT, DELETE ON TABLE public.high_ticket_article_usage TO authenticated;
GRANT ALL ON TABLE public.high_ticket_article_usage TO service_role;
