/**
 * Manager View data is now backed by `team_metrics` and `workflow_insights`
 * (type = 'manager_insight'). See `src/lib/insights.functions.ts`.
 * Only the tone helpers stay here — they're pure UI logic.
 */
export type TeamRow = { name: string; adoption: number; reps: number };
export type AdoptionTone = "success" | "warning" | "danger";

export function toneForAdoption(adoption: number): AdoptionTone {
  if (adoption >= 50) return "success";
  if (adoption >= 25) return "warning";
  return "danger";
}

export function labelForTone(tone: AdoptionTone): string {
  if (tone === "success") return "On track";
  if (tone === "warning") return "Watch";
  return "At risk";
}