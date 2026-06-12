import { createFileRoute } from "@tanstack/react-router";
import { AssistantLoadingScreen } from "@/features/assistant/AssistantLoadingScreen";

export const Route = createFileRoute("/assistant-loading")({
  head: () => ({ meta: [{ title: "AI is reviewing… — FlowCRM" }] }),
  component: AssistantLoadingScreen,
});