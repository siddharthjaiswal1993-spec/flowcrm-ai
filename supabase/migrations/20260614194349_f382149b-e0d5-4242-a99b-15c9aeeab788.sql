
-- Tighten INSERT policies
DROP POLICY "Authenticated can insert signals" ON public.signals;
CREATE POLICY "Owners or managers can insert signals" ON public.signals FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.deals d WHERE d.id = deal_id
      AND (d.owner_id = auth.uid() OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')))
  );

DROP POLICY "Authenticated can insert suggestions" ON public.ai_suggestions;
CREATE POLICY "Owners or managers can insert suggestions" ON public.ai_suggestions FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.deals d WHERE d.id = deal_id
      AND (d.owner_id = auth.uid() OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')))
  );

-- Lock down SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
