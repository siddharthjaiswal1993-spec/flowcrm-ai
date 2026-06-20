GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_analysis_runs TO authenticated;
GRANT ALL ON public.ai_analysis_runs TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_suggestions TO authenticated;
GRANT ALL ON public.ai_suggestions TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_config TO authenticated;
GRANT ALL ON public.app_config TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_health_snapshots TO authenticated;
GRANT ALL ON public.crm_health_snapshots TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.deals TO authenticated;
GRANT ALL ON public.deals TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.manager_actions TO authenticated;
GRANT ALL ON public.manager_actions TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.signals TO authenticated;
GRANT ALL ON public.signals TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_metrics TO authenticated;
GRANT ALL ON public.team_metrics TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.workflow_insights TO authenticated;
GRANT ALL ON public.workflow_insights TO service_role;