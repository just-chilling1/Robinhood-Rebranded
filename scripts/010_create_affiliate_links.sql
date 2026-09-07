-- Dedicated money-link vault (separate from comment packs in `pages`).
-- Run in the shared Supabase project (SQL Editor). Safe to run multiple times.

CREATE TABLE IF NOT EXISTS public.affiliate_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  offer_name text NOT NULL,
  affiliate_url text NOT NULL,
  niche text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT affiliate_links_offer_name_not_blank CHECK (length(trim(offer_name)) > 0),
  CONSTRAINT affiliate_links_url_not_blank CHECK (length(trim(affiliate_url)) > 0)
);

CREATE INDEX IF NOT EXISTS affiliate_links_user_id_created_at_idx
  ON public.affiliate_links (user_id, created_at DESC);

ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own affiliate links" ON public.affiliate_links;
CREATE POLICY "Users can view own affiliate links"
  ON public.affiliate_links FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own affiliate links" ON public.affiliate_links;
CREATE POLICY "Users can insert own affiliate links"
  ON public.affiliate_links FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own affiliate links" ON public.affiliate_links;
CREATE POLICY "Users can update own affiliate links"
  ON public.affiliate_links FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own affiliate links" ON public.affiliate_links;
CREATE POLICY "Users can delete own affiliate links"
  ON public.affiliate_links FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.affiliate_links TO authenticated;
GRANT ALL ON TABLE public.affiliate_links TO service_role;
