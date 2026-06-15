import { createFileRoute } from "@tanstack/react-router";
import { AssistantRecommendationReview } from "@/features/assistant/AssistantRecommendationReview";

export const Route = createFileRoute("/_authenticated/assistant")({
  head: () => ({ meta: [{ title: "AI Update — FlowCRM" }] }),
  component: AssistantRecommendationReview,
});