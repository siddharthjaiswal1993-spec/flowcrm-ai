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

Screen names match the PRD (`PRD.md`).

| # | PRD name                              | Route                | Component file                                                |
| - | ------------------------------------- | -------------------- | ------------------------------------------------------------- |
| 1 | Adoption Diagnostic Dashboard         | `/`                  | `src/features/dashboard/AdoptionDiagnosticDashboard.tsx`      |
| 2 | Role-Based Workspace                  | `/workspace`         | `src/features/workspace/RoleBasedWorkspace.tsx`               |
| 3 | AI Assistant Loading                  | `/assistant-loading` | `src/features/assistant/AssistantLoadingScreen.tsx`           |
| 4 | AI Assistant Recommendation Review    | `/assistant`         | `src/features/assistant/AssistantRecommendationReview.tsx`    |
| 5 | AI Assistant Empty Signals            | `/assistant-error`   | `src/features/assistant/AssistantEmptySignalsScreen.tsx`      |
| 6 | Manager View                          | `/team`              | `src/features/team/ManagerView.tsx`                           |

## Golden Path

`/` → *Review today's CRM priorities* → `/workspace` → *Fix with AI* on
Acme Logistics → `/assistant-loading` (auto-advances after ~1.5s) →
`/assistant` → *Accept AI Update* → back to `/` with a success banner and
updated KPIs (*Missing next steps* 48 → 47%, *Time saved* 18.5 → 18.7h,
Acme status Stale → Updated).

Alternate paths:
- *Fix with AI* on Vertex Manufacturing → `/assistant-error` (empty-signals
  state — no call notes, no email).
- *Edit before saving* → modal lets the user adjust each field, then saves.
- *Reject suggestion* → returns to `/workspace`, Acme stays stale.
- Toggle *Simulate save failure* on the assistant screen → save errors
  surface a *Save as Draft / Try Again* dialog.

## Project Structure

Code is grouped by **feature**, not by file type. Each feature owns its
data (mock state, types, constants) and its display components. Routes are
thin wrappers that mount a feature's screen component.

```
src/
├── routes/                         # TanStack Start file-based routes
│   ├── __root.tsx                  # App shell + FlowProvider
│   ├── index.tsx                   # mounts AdoptionDiagnosticDashboard
│   ├── workspace.tsx               # mounts RoleBasedWorkspace
│   ├── assistant.tsx               # mounts AssistantRecommendationReview
│   ├── assistant-loading.tsx       # mounts AssistantLoadingScreen
│   ├── assistant-error.tsx         # mounts AssistantEmptySignalsScreen
│   └── team.tsx                    # mounts ManagerView
│
├── features/                       # Feature folders (data + display)
│   ├── shared/
│   │   └── flow-store.tsx          # FlowProvider, useFlow, metrics()
│   ├── dashboard/
│   │   ├── data.ts                 # blockers, quotes, shortcuts
│   │   └── AdoptionDiagnosticDashboard.tsx
│   ├── workspace/
│   │   ├── data.ts                 # Deal type, baseDeals, tabs, helpers
│   │   └── RoleBasedWorkspace.tsx
│   ├── assistant/
│   │   ├── data.ts                 # signals, defaults, timings, steps
│   │   ├── primitives.tsx          # SectionCard, Modal, SkeletonCard, …
│   │   ├── AssistantLoadingScreen.tsx
│   │   ├── AssistantRecommendationReview.tsx
│   │   └── AssistantEmptySignalsScreen.tsx
│   └── team/
│       ├── data.ts                 # teams, insights, tone helpers
│       └── ManagerView.tsx
│
├── components/
│   ├── AppLayout.tsx               # sidebar + header shell, KpiCard, Section
│   └── ui/                         # shadcn primitives
│
├── lib/                            # cross-cutting non-feature utilities
├── styles.css                      # design tokens
├── router.tsx, start.ts, server.ts # framework wiring
└── routeTree.gen.ts                # auto-generated; do not edit
```

### Data ↔ display separation

- **`data.ts`** files hold only static mock data, types, and pure helper
  functions (e.g. `dealsWithAcceptedState`, `toneForAdoption`,
  `fixHrefFor`). No JSX, no React imports.
- **Screen components** (`*.tsx`) import from `./data` and render. State
  that drives multiple screens lives in `features/shared/flow-store.tsx`;
  state local to one screen stays in that component.
- Reusable display primitives within a feature live in a sibling file
  (e.g. `assistant/primitives.tsx`). Truly cross-feature layout lives
  under `src/components/`.

## Main Build Decisions

- **TanStack Start + file-based routing** — each screen has its own URL so
  the flow is shareable, deep-linkable, and SEO-friendly.
- **Single React Context store** (`features/shared/flow-store.tsx`) — one
  `accepted` flag drives every "before vs after" copy and metric on the
  golden path. No database is needed for a usability test.
- **Workday-inspired design system** — semantic tokens in `src/styles.css`
  (navy headings, calm blue primary, explicit danger/warning/success tones)
  applied through `AppLayout`, `KpiCard`, and `Section`.
- **Prototype, not production** — no auth, no real CRM integration, no LLM
  call. The AI suggestion is scripted to make the *test* unambiguous: are
  users faster and more confident than with the current CRM?

## Running Locally

```bash
bun install
bun run dev
```

Then open the preview and follow the golden path from `/`.

---

## What I Built

| Artifact | Description |
|---|---|
| 6-screen TanStack prototype | Complete adoption loop — diagnostic dashboard, prioritized worklist, AI loading state, recommendation review, manager view, and empty-signals error state |
| PRD | Full product requirements covering screens, user flows, hypothesis, metrics, and mocked vs. real map (`PRD.md`) |
| Standard portfolio docs | PORTFOLIO_AUDIT, PRODUCT_THESIS, WHAT_I_BUILT, OUTCOME_MODEL, AI_PRODUCT_JUDGMENT |

---

*Independent product exploration. Uses synthetic examples, mock data, and scripted AI suggestions.*
