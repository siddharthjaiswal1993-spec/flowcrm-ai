CREATE SCHEMA IF NOT EXISTS app_private;
REVOKE ALL ON SCHEMA app_private FROM PUBLIC;
GRANT USAGE ON SCHEMA app_private TO authenticated;
GRANT USAGE ON SCHEMA app_private TO service_role;

ALTER FUNCTION public.has_role(uuid, public.app_role) SET SCHEMA app_private;
ALTER FUNCTION public.get_my_team() SET SCHEMA app_private;
ALTER FUNCTION public.is_same_team_as(uuid) SET SCHEMA app_private;
ALTER FUNCTION public.can_access_deal(uuid) SET SCHEMA app_private;

CREATE OR REPLACE FUNCTION app_private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION app_private.get_my_team()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT team FROM public.profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION app_private.is_same_team_as(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles me, public.profiles them
    WHERE me.id = auth.uid()
      AND them.id = _user_id
      AND me.team IS NOT NULL
      AND me.team = them.team
  )
$$;

CREATE OR REPLACE FUNCTION app_private.can_access_deal(_deal_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public, app_private
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.deals d
    WHERE d.id = _deal_id
      AND (
        d.owner_id = auth.uid()
        OR app_private.has_role(auth.uid(), 'admin')
        OR (app_private.has_role(auth.uid(), 'manager') AND app_private.is_same_team_as(d.owner_id))
      )
  )
$$;

REVOKE EXECUTE ON FUNCTION app_private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION app_private.get_my_team() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION app_private.is_same_team_as(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION app_private.can_access_deal(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION app_private.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION app_private.get_my_team() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION app_private.is_same_team_as(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION app_private.can_access_deal(uuid) TO authenticated, service_role;