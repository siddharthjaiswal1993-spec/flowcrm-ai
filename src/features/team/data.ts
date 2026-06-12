/** Manager View data — team adoption breakdown and qualitative insights. */

export type TeamRow = { name: string; adoption: number; reps: number };

export const teams: TeamRow[] = [
  { name: "Enterprise Sales", adoption: 22, reps: 48 },
  { name: "SMB Sales", adoption: 15, reps: 62 },
  { name: "Customer Success", adoption: 31, reps: 41 },
  { name: "Account Management", adoption: 19, reps: 34 },
  { name: "RevOps", adoption: 64, reps: 12 },
];

export const adoptionInsights = [
  "61% of records have had no update in 14+ days",
  "48% of open deals are missing next steps",
  "63% of reps maintain shadow spreadsheets",
  "AI-assisted updates could reduce CRM update time from 11 minutes to under 2 minutes",
] as const;

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