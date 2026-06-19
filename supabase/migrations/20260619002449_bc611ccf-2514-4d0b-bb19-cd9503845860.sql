
DROP POLICY IF EXISTS "Read crm health snapshots" ON public.crm_health_snapshots;
DROP POLICY IF EXISTS "Read company-wide or own team snapshots" ON public.crm_health_snapshots;

CREATE POLICY "Managers and admins read crm health snapshots"
  ON public.crm_health_snapshots
  FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'manager')
  );
