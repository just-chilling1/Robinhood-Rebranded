-- Lock privileged profile columns, revoke public SECURITY DEFINER execute,
-- expose a column-limited public article view, and replace open tracking writes.

CREATE OR REPLACE FUNCTION public.protect_users_privileged_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF current_user IN ('authenticated', 'anon') THEN
    NEW.id := OLD.id;
    NEW.email := OLD.email;
    NEW.upgrade_level := OLD.upgrade_level;
    NEW.pages_generated := OLD.pages_generated;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_users_privileged_columns ON public.users;
CREATE TRIGGER protect_users_privileged_columns
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_users_privileged_columns();

REVOKE ALL ON FUNCTION public.protect_users_privileged_columns() FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.generate_slug(title text)
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RETURN lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
END;
$$;

DROP POLICY IF EXISTS "Anyone can view active pages" ON public.pages;

CREATE OR REPLACE VIEW public.active_pages
WITH (security_invoker = false) AS
SELECT
  id,
  slug,
  title,
  content,
  affiliate_link,
  views,
  created_at,
  niche_id,
  status
FROM public.pages
WHERE status = 'active';

REVOKE ALL ON public.active_pages FROM PUBLIC;
GRANT SELECT ON public.active_pages TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.increment_page_stat(p_page_id uuid, p_stat text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_stat = 'views' THEN
    UPDATE public.pages
    SET views = COALESCE(views, 0) + 1
    WHERE id = p_page_id AND status = 'active';
  ELSIF p_stat = 'clicks' THEN
    UPDATE public.pages
    SET clicks = COALESCE(clicks, 0) + 1
    WHERE id = p_page_id AND status = 'active';
  ELSE
    RAISE EXCEPTION 'invalid stat';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.increment_page_stat(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_page_stat(uuid, text) TO anon, authenticated;

DROP POLICY IF EXISTS "Allow anon insert" ON public.specialist_popup_events;

CREATE OR REPLACE FUNCTION public.track_specialist_popup(p_event text, p_country text, p_user_agent text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_event NOT IN ('cta_call_click', 'popup_open') THEN
    RAISE EXCEPTION 'invalid event';
  END IF;

  INSERT INTO public.specialist_popup_events (event, user_id, country, user_agent)
  VALUES (
    p_event,
    auth.uid(),
    left(COALESCE(p_country, ''), 16),
    left(COALESCE(p_user_agent, ''), 300)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.track_specialist_popup(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.track_specialist_popup(text, text, text) TO anon, authenticated;
