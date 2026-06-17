
-- =========================================================
-- 1. NEW TABLES
-- =========================================================

-- crm_health_snapshots
CREATE TABLE public.crm_health_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team text,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  crm_adoption_pct int NOT NULL DEFAULT 18,
  weekly_active_users int NOT NULL DEFAULT 42,
  licensed_users int NOT NULL DEFAULT 230,
  avg_update_time_minutes int NOT NULL DEFAULT 11,
  target_update_time_minutes int NOT NULL DEFAULT 2,
  shadow_spreadsheet_usage_pct int NOT NULL DEFAULT 63,
  internal_csat_score int NOT NULL DEFAULT 21,
  duplicate_accounts_pct int NOT NULL DEFAULT 17,
  data_quality_score int NOT NULL DEFAULT 54,
  forecast_confidence_pct int NOT NULL DEFAULT 41,
  forecast_confidence_target_pct int NOT NULL DEFAULT 68,
  time_saved_hours int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_health_snapshots TO authenticated;
GRANT ALL ON public.crm_health_snapshots TO service_role;
ALTER TABLE public.crm_health_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All signed-in users can read crm_health_snapshots"
  ON public.crm_health_snapshots FOR SELECT TO authenticated USING (true);
CREATE POLICY "Managers/admins can insert crm_health_snapshots"
  ON public.crm_health_snapshots FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Managers/admins can update crm_health_snapshots"
  ON public.crm_health_snapshots FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Managers/admins can delete crm_health_snapshots"
  ON public.crm_health_snapshots FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));

-- team_metrics
CREATE TABLE public.team_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name text NOT NULL,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  adoption_pct int NOT NULL,
  rep_count int NOT NULL,
  stale_records_count int NOT NULL DEFAULT 0,
  missing_next_steps_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_metrics TO authenticated;
GRANT ALL ON public.team_metrics TO service_role;
ALTER TABLE public.team_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All signed-in users can read team_metrics"
  ON public.team_metrics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Managers/admins can insert team_metrics"
  ON public.team_metrics FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Managers/admins can update team_metrics"
  ON public.team_metrics FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Managers/admins can delete team_metrics"
  ON public.team_metrics FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));

-- workflow_insights
CREATE TABLE public.workflow_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  text text NOT NULL,
  attribution text,
  team text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workflow_insights TO authenticated;
GRANT ALL ON public.workflow_insights TO service_role;
ALTER TABLE public.workflow_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All signed-in users can read workflow_insights"
  ON public.workflow_insights FOR SELECT TO authenticated USING (true);
CREATE POLICY "Managers/admins can insert workflow_insights"
  ON public.workflow_insights FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Managers/admins can update workflow_insights"
  ON public.workflow_insights FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Managers/admins can delete workflow_insights"
  ON public.workflow_insights FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER workflow_insights_set_updated_at
  BEFORE UPDATE ON public.workflow_insights
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ai_analysis_runs
CREATE TABLE public.ai_analysis_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  status text NOT NULL,
  reviewed_source_count int NOT NULL DEFAULT 0,
  confidence int,
  reasoning text,
  loading_steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_analysis_runs TO authenticated;
GRANT ALL ON public.ai_analysis_runs TO service_role;
ALTER TABLE public.ai_analysis_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own runs; managers/admins read all"
  ON public.ai_analysis_runs FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR public.has_role(auth.uid(), 'manager')
    OR public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Users insert their own runs"
  ON public.ai_analysis_runs FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update their own runs"
  ON public.ai_analysis_runs FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- manager_actions
CREATE TABLE public.manager_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  action_type text NOT NULL,
  role_required text NOT NULL DEFAULT 'manager',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.manager_actions TO authenticated;
GRANT ALL ON public.manager_actions TO service_role;
ALTER TABLE public.manager_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All signed-in users can read manager_actions"
  ON public.manager_actions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Managers/admins can insert manager_actions"
  ON public.manager_actions FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Managers/admins can update manager_actions"
  ON public.manager_actions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Managers/admins can delete manager_actions"
  ON public.manager_actions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));

-- app_config
CREATE TABLE public.app_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_config TO authenticated;
GRANT ALL ON public.app_config TO service_role;
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All signed-in users can read app_config"
  ON public.app_config FOR SELECT TO authenticated USING (true);
CREATE POLICY "Managers/admins can insert app_config"
  ON public.app_config FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Managers/admins can update app_config"
  ON public.app_config FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Managers/admins can delete app_config"
  ON public.app_config FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER app_config_set_updated_at
  BEFORE UPDATE ON public.app_config
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- 2. ALTER EXISTING TABLES
-- =========================================================

ALTER TABLE public.deals
  ADD COLUMN next_step text,
  ADD COLUMN objection text,
  ADD COLUMN follow_up text,
  ADD COLUMN health text,
  ADD COLUMN required_fields_completed int DEFAULT 2,
  ADD COLUMN total_required_fields int DEFAULT 8;

ALTER TABLE public.ai_suggestions
  ADD COLUMN reasoning text,
  ADD COLUMN source_signal_ids jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN impact_preview jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN auto_filled_field_names jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN save_error_message text;

ALTER TABLE public.profiles
  ADD COLUMN avatar_initials text,
  ADD COLUMN manager_id uuid;

-- =========================================================
-- 3. SEED DATA
-- =========================================================

-- Workflow blockers (from dashboard/data.ts)
INSERT INTO public.workflow_insights (type, text, display_order) VALUES
  ('blocker', 'Too many required fields', 1),
  ('blocker', 'No clear daily priority view', 2),
  ('blocker', 'CRM updates feel like management reporting', 3),
  ('blocker', 'Users already work in spreadsheets and email', 4),
  ('blocker', 'Data is stale, so managers don''t trust it', 5);

-- Voice-of-user quotes
INSERT INTO public.workflow_insights (type, text, attribution, display_order) VALUES
  ('quote', 'It''s faster to keep my deals in a spreadsheet than to fight the CRM''s eight required fields.', 'Account Executive · 2 logins/month', 1),
  ('quote', 'I never know where the thing I need lives. Every screen looks like a settings page.', 'Sales Rep · onboarded but inactive', 2),
  ('quote', 'Logging activity feels like data entry for management, not something that helps me sell.', 'Senior AE', 3),
  ('quote', 'If it could just tell me who to call next, I''d open it every morning.', 'SDR · occasional user', 4);

-- AI suggestion shortcuts
INSERT INTO public.workflow_insights (type, text, display_order) VALUES
  ('ai_shortcut', 'Fix 3 stale deals with AI', 1),
  ('ai_shortcut', 'Add next steps to 5 deals', 2),
  ('ai_shortcut', 'Review 23 AI suggestions', 3);

-- Manager insights (from team/data.ts adoptionInsights)
INSERT INTO public.workflow_insights (type, text, display_order) VALUES
  ('manager_insight', '61% of records have had no update in 14+ days', 1),
  ('manager_insight', '48% of open deals are missing next steps', 2),
  ('manager_insight', '63% of reps maintain shadow spreadsheets', 3),
  ('manager_insight', 'AI-assisted updates could reduce CRM update time from 11 minutes to under 2 minutes', 4);

-- Team metrics
INSERT INTO public.team_metrics (team_name, period_start, period_end, adoption_pct, rep_count) VALUES
  ('Enterprise Sales',    now() - interval '7 days', now(), 22, 48),
  ('SMB Sales',           now() - interval '7 days', now(), 15, 62),
  ('Customer Success',    now() - interval '7 days', now(), 31, 41),
  ('Account Management',  now() - interval '7 days', now(), 19, 34),
  ('RevOps',              now() - interval '7 days', now(), 64, 12);

-- CRM health baseline snapshot
INSERT INTO public.crm_health_snapshots (period_start, period_end) VALUES
  (now() - interval '7 days', now());

-- Manager actions
INSERT INTO public.manager_actions (label, action_type) VALUES
  ('Review adoption gaps', 'review_gaps'),
  ('Send smart nudges',    'send_nudges'),
  ('Export adoption summary', 'export_summary');

-- App config
INSERT INTO public.app_config (key, value) VALUES
  ('app_version',  'v0.4 Prototype'),
  ('product_name', 'FlowCRM AI Workspace'),
  ('meta_title',   'FlowCRM AI Workspace');
