-- Track one-time onboarding completion per user
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

-- Backfill: accounts created before this feature skip onboarding (adjust interval if needed)
UPDATE public.users
SET onboarding_completed_at = NOW()
WHERE onboarding_completed_at IS NULL
  AND created_at < (NOW() - INTERVAL '1 hour');
