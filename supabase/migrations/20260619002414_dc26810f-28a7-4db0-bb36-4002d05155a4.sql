
-- 1) Lock down profile.team so users cannot self-assign teams (privilege escalation vector)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND team IS NOT DISTINCT FROM (SELECT team FROM public.profiles WHERE id = auth.uid())
  );

-- Admins may update team assignment
CREATE POLICY "Admins can update any profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2) Restrict company-wide CRM health snapshots (team IS NULL) to managers/admins
DROP POLICY IF EXISTS "Users can read crm health snapshots for their team" ON public.crm_health_snapshots;
DROP POLICY IF EXISTS "Users read relevant crm health snapshots" ON public.crm_health_snapshots;
DROP POLICY IF EXISTS "Read crm health snapshots" ON public.crm_health_snapshots;

CREATE POLICY "Read crm health snapshots"
  ON public.crm_health_snapshots
  FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'manager')
    OR (team IS NOT NULL AND public.get_my_team() = team)
  );

-- 3) Revoke EXECUTE on SECURITY DEFINER helpers from signed-in users.
-- These are only called inside RLS policies / other SECURITY DEFINER functions,
-- which run as the function owner and don't need the caller to hold EXECUTE.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_my_team() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_same_team_as(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.can_access_deal(uuid) FROM PUBLIC, anon, authenticated;
