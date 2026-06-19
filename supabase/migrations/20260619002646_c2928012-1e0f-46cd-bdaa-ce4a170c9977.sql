
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_team() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_same_team_as(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_access_deal(uuid) TO authenticated;
