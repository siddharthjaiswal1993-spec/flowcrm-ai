import { createFileRoute } from "@tanstack/react-router";
import { RoleBasedWorkspace } from "@/features/workspace/RoleBasedWorkspace";

export const Route = createFileRoute("/_authenticated/workspace")({
  head: () => ({ meta: [{ title: "My CRM Work — FlowCRM" }] }),
  component: RoleBasedWorkspace,
});