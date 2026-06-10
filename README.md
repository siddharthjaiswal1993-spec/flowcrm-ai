# FlowCRM AI Workspace

An AI-native adoption layer on top of an existing internal CRM. This is a
high-fidelity, clickable Lovable prototype — not a CRM rebuild — designed to
test whether a lightweight workflow + intelligence layer can move weekly active
adoption from 18% to something people actually use.

## Hypothesis

Reps don't avoid the CRM because they dislike CRMs. They avoid it because:

- Updating records is slow, manual, and duplicative of work already done in
  calls, email, and Slack.
- The CRM tells them what fields are empty, not what to do next.
- Managers chase updates instead of getting trustworthy forecasts.

**If** we surface a prioritized, role-aware daily worklist and let an AI draft
CRM updates from existing signals (call notes, email, calendar), **then**
weekly active adoption, data freshness, and forecast confidence all improve —
because the CRM finally saves time instead of costing it.

## Scenario

You are a Sales Rep at a mid-market B2B SaaS company. It's Monday morning.
The Acme Logistics deal ($148K, Stage: Proposal) hasn't been updated in
14 days, but you had a discovery call Friday and two email threads over the
weekend. The current CRM shows the deal as stale and at risk. FlowCRM has
already read the signals and drafted the update.

## Key Screens

1. **Adoption Diagnostic (`/`)** — Landing dashboard. Shows the 18% weekly
   active adoption KPI, qualitative quotes explaining why, and the primary
   CTA: *Review Today's CRM Priorities*.
2. **Role-Based Workspace (`/workspace`)** — The Sales Rep's prioritized
   daily worklist. Highlights the stale Acme Logistics deal with a
   *Fix with AI* action.
3. **AI Assistant (`/assistant`)** — Focused flow for the Acme deal. Shows
   source signals (call notes, emails), the AI-suggested field updates, and
   an *Accept AI Update* action.
4. **Manager View (`/team`)** — Adoption by team segment, data freshness,
   and forecast confidence — the manager's payoff for rep adoption.

## Golden Path

Dashboard → Review Today's CRM Priorities → Fix Acme Logistics with AI →
Accept AI Update → Return to Dashboard with updated metrics
(*Missing next steps* drops to 47%, *Time saved* rises to 18.7h).

## Main Build Decisions

- **TanStack Start + file-based routing** — four route files (`index`,
  `workspace`, `assistant`, `team`) keep each screen independently shareable
  and the navigation type-safe.
- **Local React Context store (`src/lib/store.tsx`)** — a single
  `FlowProvider` toggles the Acme deal between *Stale* and *Updated* so the
  golden path mutates real dashboard KPIs without a backend. No database is
  needed for a usability test.
- **Workday-inspired design system** — semantic tokens in `src/styles.css`
  (navy headings, calm blue primary, explicit danger/warning/success tones)
  applied through `AppLayout`, `KpiCard`, and `Section` so every screen feels
  like the same enterprise product.
- **Prototype, not production** — no auth, no real CRM integration, no LLM
  call. The AI suggestion is scripted to make the *test* unambiguous: are
  users faster and more confident than with the current CRM?

## Running Locally

```bash
bun install
bun run dev
```

Then open the preview and follow the golden path from `/`.
