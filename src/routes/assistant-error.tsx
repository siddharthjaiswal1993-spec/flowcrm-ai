import { createFileRoute } from "@tanstack/react-router";
import { AssistantEmptySignalsScreen } from "@/features/assistant/AssistantEmptySignalsScreen";

export const Route = createFileRoute("/assistant-error")({
  head: () => ({ meta: [{ title: "AI could not generate update — FlowCRM" }] }),
  component: AssistantEmptySignalsScreen,
});