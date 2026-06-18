
-- ============================================================
-- Helper functions (SECURITY DEFINER, bypass RLS to avoid recursion)
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_my_team()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT team FROM public.profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.is_same_team_as(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
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

REVOKE EXECUTE ON FUNCTION public.get_my_team() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_same_team_as(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_team() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_same_team_as(uuid) TO authenticated;

-- Predicate helper: can current user access a given deal?
CREATE OR REPLACE FUNCTION public.can_access_deal(_deal_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.deals d
    WHERE d.id = _deal_id
      AND (
        d.owner_id = auth.uid()
        OR public.has_role(auth.uid(), 'admin')
        OR (public.has_role(auth.uid(), 'manager') AND public.is_same_team_as(d.owner_id))
      )
  )
$$;
REVOKE EXECUTE ON FUNCTION public.can_access_deal(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.can_access_deal(uuid) TO authenticated;

-- ============================================================
-- profiles
-- ============================================================
DROP POLICY IF EXISTS "Authenticated can read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Managers read team profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins manage profiles" ON public.profiles;

CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid());
CREATE POLICY "Managers read team profiles" ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'manager') AND team IS NOT NULL AND team = public.get_my_team());
CREATE POLICY "Admins read all profiles" ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update all profiles" ON public.profiles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- user_roles: only admins manage; reps cannot self-promote
-- ============================================================
DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Admins read all roles" ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert roles" ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update roles" ON public.user_roles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete roles" ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- deals
-- ============================================================
DROP POLICY IF EXISTS "Authenticated can read deals" ON public.deals;
DROP POLICY IF EXISTS "Owners or managers can insert deals" ON public.deals;
DROP POLICY IF EXISTS "Owners or managers can update deals" ON public.deals;
DROP POLICY IF EXISTS "Owners or managers can delete deals" ON public.deals;

CREATE POLICY "Read own/team/all deals" ON public.deals FOR SELECT TO authenticated
  USING (
    owner_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR (public.has_role(auth.uid(), 'manager') AND public.is_same_team_as(owner_id))
  );
CREATE POLICY "Insert own deals or admin" ON public.deals FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Update own/team/all deals" ON public.deals FOR UPDATE TO authenticated
  USING (
    owner_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR (public.has_role(auth.uid(), 'manager') AND public.is_same_team_as(owner_id))
  );
CREATE POLICY "Delete own or admin deals" ON public.deals FOR DELETE TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- signals
-- ============================================================
DROP POLICY IF EXISTS "Authenticated can read signals" ON public.signals;
CREATE POLICY "Read signals via deal access" ON public.signals FOR SELECT TO authenticated
  USING (public.can_access_deal(deal_id));
CREATE POLICY "Delete signals via deal access" ON public.signals FOR DELETE TO authenticated
  USING (public.can_access_deal(deal_id));

-- ============================================================
-- ai_suggestions
-- ============================================================
DROP POLICY IF EXISTS "Authenticated can read suggestions" ON public.ai_suggestions;
DROP POLICY IF EXISTS "Reviewer or deal owner can update suggestions" ON public.ai_suggestions;
DROP POLICY IF EXISTS "Owners or managers can insert suggestions" ON public.ai_suggestions;

CREATE POLICY "Read suggestions via deal access" ON public.ai_suggestions FOR SELECT TO authenticated
  USING (public.can_access_deal(deal_id));
CREATE POLICY "Insert suggestions via deal access" ON public.ai_suggestions FOR INSERT TO authenticated
  WITH CHECK (public.can_access_deal(deal_id));
CREATE POLICY "Update suggestions via deal access" ON public.ai_suggestions FOR UPDATE TO authenticated
  USING (public.can_access_deal(deal_id)) WITH CHECK (public.can_access_deal(deal_id));
CREATE POLICY "Delete suggestions via admin" ON public.ai_suggestions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- crm_health_snapshots
-- ============================================================
DROP POLICY IF EXISTS "All signed-in users can read crm_health_snapshots" ON public.crm_health_snapshots;
CREATE POLICY "Read company-wide or own team snapshots" ON public.crm_health_snapshots FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    OR team IS NULL
    OR team = public.get_my_team()
  );

-- ============================================================
-- team_metrics
-- ============================================================
DROP POLICY IF EXISTS "All signed-in users can read team_metrics" ON public.team_metrics;
CREATE POLICY "Managers read own team metrics; admins all" ON public.team_metrics FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    OR (public.has_role(auth.uid(), 'manager') AND team_name = public.get_my_team())
  );

-- ============================================================
-- workflow_insights / manager_actions / app_config
-- Keep authenticated read of active rows; admins manage all (already exists for manager+admin).
-- Tighten: only admins (not managers) manage write per spec.
-- ============================================================
DROP POLICY IF EXISTS "Managers/admins can insert workflow_insights" ON public.workflow_insights;
DROP POLICY IF EXISTS "Managers/admins can update workflow_insights" ON public.workflow_insights;
DROP POLICY IF EXISTS "Managers/admins can delete workflow_insights" ON public.workflow_insights;
CREATE POLICY "Admins manage workflow_insights ins" ON public.workflow_insights FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage workflow_insights upd" ON public.workflow_insights FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage workflow_insights del" ON public.workflow_insights FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Managers/admins can insert manager_actions" ON public.manager_actions;
DROP POLICY IF EXISTS "Managers/admins can update manager_actions" ON public.manager_actions;
DROP POLICY IF EXISTS "Managers/admins can delete manager_actions" ON public.manager_actions;
CREATE POLICY "Admins manage manager_actions ins" ON public.manager_actions FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage manager_actions upd" ON public.manager_actions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage manager_actions del" ON public.manager_actions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Managers/admins can insert app_config" ON public.app_config;
DROP POLICY IF EXISTS "Managers/admins can update app_config" ON public.app_config;
DROP POLICY IF EXISTS "Managers/admins can delete app_config" ON public.app_config;
CREATE POLICY "Admins manage app_config ins" ON public.app_config FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage app_config upd" ON public.app_config FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage app_config del" ON public.app_config FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- ai_analysis_runs
-- ============================================================
DROP POLICY IF EXISTS "Users read own runs; managers/admins read all" ON public.ai_analysis_runs;
CREATE POLICY "Read own/team/all runs" ON public.ai_analysis_runs FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR (public.has_role(auth.uid(), 'manager') AND public.is_same_team_as(user_id))
  );

-- ============================================================
-- handle_new_user: ensure default rep role and profile (idempotent)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, team)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'team'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'rep')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
