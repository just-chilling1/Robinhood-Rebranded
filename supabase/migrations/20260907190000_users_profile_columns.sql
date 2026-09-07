-- Align public.users with app expectations used by onboarding/profile/dashboard.
-- Safe to run multiple times.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS upgrade_level TEXT DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS pages_generated INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Refresh PostgREST schema cache so new columns are visible immediately.
NOTIFY pgrst, 'reload schema';
