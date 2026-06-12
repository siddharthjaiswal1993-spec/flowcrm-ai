import { createFileRoute } from "@tanstack/react-router";
import { AssistantRecommendationReview } from "@/features/assistant/AssistantRecommendationReview";

export const Route = createFileRoute("/assistant")({
  head: () => ({ meta: [{ title: "AI Update — Acme Logistics" }] }),
  component: AssistantRecommendationReview,
});