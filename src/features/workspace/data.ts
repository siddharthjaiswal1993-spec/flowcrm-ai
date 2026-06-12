/** Deal data + role tabs for the Role-Based Workspace screen. */

export type DealStatus = "Stale" | "At risk" | "Active" | "Updated";

export type Deal = {
  id: string;
  account: string;
  owner: string;
  stage: string;
  value: number;
  lastActivity: string;
  problem: string;
  signal: string;
  suggested: string;
  status: DealStatus;
};

export const baseDeals: Deal[] = [
  {
    id: "acme",
    account: "Acme Logistics",
    owner: "Riya Sharma",
    stage: "Proposal",
    value: 84000,
    lastActivity: "18 days ago",
    problem: "Missing next step",
    signal: "Pricing objection mentioned in call notes",
    suggested: "Schedule pricing review call for Friday",
    status: "Stale",
  },
  {
    id: "northstar",
    account: "Northstar Retail",
    owner: "Kabir Mehta",
    stage: "Negotiation",
    value: 126000,
    lastActivity: "9 days ago",
    problem: "No decision-maker mapped",
    signal: "Email thread mentions CFO approval",
    suggested: "Add CFO as economic buyer",
    status: "At risk",
  },
  {
    id: "bluepeak",
    account: "BluePeak Software",
    owner: "Ananya Rao",
    stage: "Discovery",
    value: 52000,
    lastActivity: "3 days ago",
    problem: "Follow-up due today",
    signal: "Demo requested by VP Sales",
    suggested: "Send demo scheduling email",
    status: "Active",
  },
  {
    id: "vertex",
    account: "Vertex Manufacturing",
    owner: "Arjun Nair",
    stage: "Qualification",
    value: 39000,
    lastActivity: "22 days ago",
    problem: "Deal has no next step",
    signal: "No activity after discovery call",
    suggested: "Send re-engagement email",
    status: "Stale",
  },
];

/** Apply the "Acme accepted" overlay to the base deals. */
export function dealsWithAcceptedState(accepted: boolean): Deal[] {
  return baseDeals.map((d) =>
    d.id === "acme" && accepted
      ? {
          ...d,
          status: "Updated" as DealStatus,
          lastActivity: "just now",
          problem: "Next step added: pricing review Friday",
        }
      : d,
  );
}

export const roleTabs = ["Sales Rep", "Customer Success", "Manager"] as const;
export type RoleTab = (typeof roleTabs)[number];

export const customerSuccessItems = [
  { title: "Helix Health · QBR overdue", meta: "Renewal in 42 days · health: yellow" },
  { title: "Orbit Media · usage dropped 31%", meta: "Last login 12 days ago" },
  { title: "Pinecone Foods · NPS detractor", meta: "Score: 4 · respond within 48h" },
];

export const managerItems = [
  { title: "SMB Sales adoption stuck at 15%", meta: "12 reps haven't logged in this week" },
  { title: "Forecast confidence at 41%", meta: "Driven by 61% stale records" },
  { title: "9 deals over $50k with no next step", meta: "Across 4 reps" },
];

/** Where "Fix with AI" routes for each deal in the prototype. */
export function fixHrefFor(dealId: string): "/assistant" | "/assistant-loading" | "/assistant-error" {
  if (dealId === "acme") return "/assistant-loading";
  if (dealId === "vertex") return "/assistant-error";
  return "/assistant";
}