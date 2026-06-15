import { createFileRoute } from "@tanstack/react-router";
import { AdoptionDiagnosticDashboard } from "@/features/dashboard/AdoptionDiagnosticDashboard";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "Adoption Diagnostic — FlowCRM" },
      { name: "description", content: "Diagnose CRM adoption and act on stale records with AI." },
    ],
  }),
  component: AdoptionDiagnosticDashboard,
});