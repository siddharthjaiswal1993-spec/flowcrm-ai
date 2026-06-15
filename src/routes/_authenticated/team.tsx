import { createFileRoute } from "@tanstack/react-router";
import { ManagerView } from "@/features/team/ManagerView";

export const Route = createFileRoute("/_authenticated/team")({
  head: () => ({ meta: [{ title: "Team Adoption — FlowCRM" }] }),
  component: ManagerView,
});