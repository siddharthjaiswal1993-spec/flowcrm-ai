/** Mock data for the Adoption Diagnostic Dashboard. */

export const workflowBlockers = [
  "Too many required fields",
  "No clear daily priority view",
  "CRM updates feel like management reporting",
  "Users already work in spreadsheets and email",
  "Data is stale, so managers don't trust it",
] as const;

export type Quote = { text: string; who: string };

export const voiceOfUser: Quote[] = [
  {
    text: "It's faster to keep my deals in a spreadsheet than to fight the CRM's eight required fields.",
    who: "Account Executive · 2 logins/month",
  },
  {
    text: "I never know where the thing I need lives. Every screen looks like a settings page.",
    who: "Sales Rep · onboarded but inactive",
  },
  {
    text: "Logging activity feels like data entry for management, not something that helps me sell.",
    who: "Senior AE",
  },
  {
    text: "If it could just tell me who to call next, I'd open it every morning.",
    who: "SDR · occasional user",
  },
];

export const aiSuggestionShortcuts = [
  "Fix 3 stale deals with AI",
  "Add next steps to 5 deals",
  "Review 23 AI suggestions",
] as const;