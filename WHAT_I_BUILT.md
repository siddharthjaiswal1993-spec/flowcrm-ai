# What I Built — FlowCRM AI Workspace

---

## The Artifact

A high-fidelity, clickable prototype built with TanStack Start, React, TypeScript, and Tailwind CSS. The prototype covers the complete adoption loop: diagnosis → prioritization → AI-assisted update → outcome feedback.

**Live path:**
`/` (Dashboard) → `/workspace` (Daily Worklist) → `/assistant-loading` (AI Analysis) → `/assistant` (Review & Accept) → `/` (Updated Dashboard with metric diffs)

---

## What I Built

**6 fully interactive screens:**

| Screen | Route | What it demonstrates |
|---|---|---|
| Adoption Diagnostic Dashboard | `/` | CRM health KPIs, root cause analysis, voice-of-user quotes, AI sidebar with prioritized suggestions |
| Role-Based Workspace | `/workspace` | Prioritized deal worklist with staleness signals; "Fix with AI" action per deal |
| AI Loading State | `/assistant-loading` | Skeleton cards + progress message while AI "reads" signals (~1.5s) |
| AI Recommendation Review | `/assistant` | Source evidence (call notes, email, CRM history), AI-drafted field updates, confidence score, accept/edit/reject hierarchy |
| Manager View | `/team` | Adoption by team segment, data freshness, forecast confidence |
| Error State | `/assistant-error` | Empty-signals path (no call note or email found for Vertex Manufacturing) |

**State machine:** A single React Context (`FlowProvider`) drives the "before vs. after" state across all screens. Accepting the Acme Logistics update changes KPIs on the dashboard, worklist status, and metric diffs in real time — without a database.

**Feature-based architecture:** Code is organized by feature (dashboard, workspace, assistant, team), each owning its data and display components separately. A `data.ts` / component split enforces clean separation.

---

## Design Decisions

- **Workday-inspired design system** — deep navy headings, calm blue primary actions, rounded cards, soft white/grey background. Enterprise-ready, not playful.
- **Evidence-first AI panel** — source signals (call note, email, CRM history) are shown before the recommendation, so the rep validates the evidence before acting.
- **Honest error state** — when signals are missing, the AI says it cannot generate a recommendation rather than generating a low-quality one.
- **Save error modal** — simulates CRM save failure with a "Save as Draft / Try Again / Cancel" dialog — a realistic edge case not usually prototyped.

---

## What Is Mocked

Per PRD Section 8:
- AI suggestions are scripted (no LLM call)
- Save flow uses timed UI states (no network call)
- Source signals are static example content
- Manager metrics are illustrative numbers

The prototype is honest about this. Its purpose is to test whether users understand the workflow and find value in AI-drafted updates — not to prove the AI works.
