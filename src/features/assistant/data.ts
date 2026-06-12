import { Phone, Mail, FileText, RefreshCw } from "lucide-react";
import type { ComponentType } from "react";

/** Mock evidence the AI "reviewed" for Acme Logistics. */

export type SignalSource = {
  icon: ComponentType<{ className?: string }>;
  source: string;
  text: string;
};

export const acmeSignals: SignalSource[] = [
  {
    icon: Phone,
    source: "Call note · 19 days ago",
    text: "Customer asked if pricing can be adjusted for multi-location rollout.",
  },
  {
    icon: Mail,
    source: "Email snippet · 12 days ago",
    text: "Can we discuss pricing options before moving forward?",
  },
  {
    icon: FileText,
    source: "CRM history",
    text: "Proposal sent 18 days ago, no next step logged.",
  },
];

/** Default AI-suggested update for the Acme review screen. */
export const acmeSuggestedDefaults = {
  nextStep: "Schedule pricing review call for Friday",
  objection: "Pricing concern",
  followUp: "Send pricing options and book review call",
  health: "At risk",
};

/** Sources missing for Vertex (drives the empty-signals state). */
export const vertexMissingSources = [
  { icon: Phone, label: "Call notes", detail: "0 in last 30 days" },
  { icon: Mail, label: "Email signals", detail: "0 in last 30 days" },
  { icon: RefreshCw, label: "CRM activity", detail: "22 days stale" },
] as const;

/** Steps shown in the loading drawer while AI "reviews" Acme. */
export const loadingSteps = [
  { label: "Pulled deal history (18 days)", state: "done" as const },
  { label: "Scanned 2 call notes", state: "done" as const },
  { label: "Reading 4 emails for objections", state: "active" as const },
  { label: "Drafting next step + follow-up task", state: "pending" as const },
  { label: "Auto-filling required CRM fields", state: "pending" as const },
];

/** Milliseconds the loading screen waits before redirecting to the review. */
export const LOADING_DURATION_MS = 1500;

/** Milliseconds the simulated CRM save takes. */
export const SAVE_DURATION_MS = 1400;