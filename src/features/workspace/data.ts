/** Role tabs + lightweight item lists for the Role-Based Workspace screen. */

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