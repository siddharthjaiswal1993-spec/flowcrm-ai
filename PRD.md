# FlowCRM AI Workspace — Product Requirements Document

**Version:** 0.1 (Prototype)
**Status:** Clickable usability prototype (Lovable)
**Owner:** Product

---

## 1. What It Does

FlowCRM is an **AI-native adoption layer** that sits on top of an existing internal CRM. Instead of asking sales reps to fill out long forms, it:

- Surfaces a **prioritized daily worklist** of the CRM records that actually need attention.
- Reads existing signals (call notes, email threads, calendar) and **drafts CRM field updates** for the rep to accept, edit, or reject.
- Gives managers a **forecast confidence and adoption view** that improves automatically as reps accept AI updates.

It is not a CRM replacement. It is the workflow + intelligence layer that makes the underlying CRM worth opening.

---

## 2. Who It's For

| Persona | Primary need |
|---|---|
| **Sales Rep / AE** (primary) | Spend less time on data entry; know what to do next today. |
| **Sales Manager** (secondary) | Trustworthy pipeline data and forecast confidence without chasing reps. |
| **RevOps / CRM Admin** (tertiary) | Higher adoption and data quality without re-launching the CRM. |

---

## 3. Problem It Solves

The existing CRM has **18% weekly active adoption**. Diagnostic interviews surfaced four root causes:

1. Updating records is slow and duplicates work already done in calls, email, and Slack.
2. The CRM tells reps which fields are empty, not what to do next.
3. Reps experience CRM updates as "data entry for management," not a tool that helps them sell.
4. Managers don't trust stale data, so they ask reps directly — reinforcing the loop.

**Hypothesis:** If reps get a prioritized worklist and AI-drafted updates from existing signals, weekly active adoption, data freshness, and forecast confidence all improve — because the CRM finally saves time instead of costing it.

---

## 4. Screens

| # | Route | Screen | Purpose |
|---|---|---|---|
| 1 | `/` | **Adoption Diagnostic Dashboard** | Frames the problem: 18% adoption KPI, stale-record stats, qualitative quotes, and the primary CTA *Review Today's CRM Priorities*. After a successful update, shows a success banner with metric diffs. |
| 2 | `/workspace` | **Role-Based Workspace (My CRM Work)** | The rep's prioritized daily worklist. Highlights the stale Acme Logistics deal with a *Fix with AI* action; Vertex Manufacturing is the error-path entry point. |
| 3 | `/assistant-loading` | **AI Assistant — Loading State** | After clicking *Fix with AI*, shows skeleton cards for CRM history, call notes, email thread, and suggested update with the message "Reviewing CRM history, call notes, and email signals…". Auto-advances after ~1.5s. |
| 4 | `/assistant` | **AI Assistant — Recommendation Review** | Focused review of the Acme deal: current CRM state (2 of 8 fields complete), source signals (call notes + emails), AI-suggested updates with 92% confidence, impact preview, and action hierarchy (Accept / Edit / Reject). Handles saving + save-error modal states. |
| 5 | `/assistant-error` | **AI Assistant — Empty Signals State** | Vertex Manufacturing path. Explains that AI could not generate a recommendation because no recent call note or email exists, and offers a manual follow-up CTA. |
| 6 | `/team` | **Manager View** | Adoption by team segment, data freshness, and forecast confidence — the manager's payoff for rep adoption. |

---

## 5. User Flow

### Golden path (Acme Logistics)
1. **Dashboard (`/`)** — Rep sees 18% adoption KPI and clicks *Review Today's CRM Priorities*.
2. **Workspace (`/workspace`)** — Acme Logistics is flagged Stale. Rep clicks *Fix with AI*.
3. **Loading (`/assistant-loading`)** — Skeleton cards + progress messages (~1.5s).
4. **Assistant (`/assistant`)** — Rep reviews source signals and 6 auto-filled field suggestions.
5. **Accept AI Update** → "Saving CRM update…" overlay → redirect to dashboard.
6. **Dashboard** — Success banner shows diffs: *Missing next steps 48% → 47%*, *Time saved 18.5h → 18.7h*, *Acme Logistics Stale → Updated*.

### Alternate paths
- **Edit before saving** — Opens modal to adjust next step, objection, follow-up, or health, then accept.
- **Reject suggestion** — Warning modal; deal remains Stale in workspace.
- **Save error** — Modal offers Try Again / Save as Draft / Cancel.
- **Empty signals (Vertex Manufacturing)** — *Fix with AI* leads to `/assistant-error` with a manual follow-up CTA.

---

## 6. Hypothesis

> If we surface a prioritized, role-aware daily worklist **and** let an AI draft CRM updates from existing signals, **then** weekly active adoption, data freshness, and forecast confidence all improve — because the CRM saves time instead of costing it.

Specifically, the prototype tests three sub-hypotheses:
1. Reps will accept ≥60% of AI-drafted updates when source evidence is visible.
2. A "Fix with AI" interaction will be faster than the equivalent manual CRM form (target: under 30 seconds vs. multi-minute today).
3. Managers will report higher confidence in forecast data after one week of AI-assisted updates.

---

## 7. Key Metrics

### Adoption (primary)
- **Weekly active adoption rate** — baseline 18%, target 45% in 90 days.
- **Weekly active users** — currently shown in-app (e.g. WAU / total).
- **Shadow spreadsheet usage** — baseline 63% of reps, target ↓.

### Data quality
- **Stale records** — baseline 61%.
- **Missing next steps** — baseline 48%, golden path moves this to 47%.
- **Data quality score** — composite (0–100).
- **Duplicate accounts** — baseline 17%.

### AI workflow
- **AI suggestion acceptance rate** — target ≥60% (prototype shows 72%).
- **Auto-filled fields per deal** — prototype shows 6 of 8.
- **Average update time** — target ≤2 min.
- **Time saved per week** — prototype shows 18.5h → 18.7h after one accept.

### Manager outcomes
- **Forecast confidence** — managerial self-report + variance vs. actual.
- **Internal CSAT for the CRM** — baseline 2.1 / 5.

---

## 8. Mocked vs. Real

| Area | Status | Notes |
|---|---|---|
| Routing & navigation (`/`, `/workspace`, `/assistant`, `/assistant-loading`, `/assistant-error`, `/team`) | **Real** | TanStack Start file-based routes. |
| Design system (tokens, layout, KPI cards, sections) | **Real** | `src/styles.css`, `AppLayout`, `KpiCard`, `Section`. |
| Acme Logistics state transition (Stale → Updated) and KPI diffs | **Real (in-memory)** | React Context `FlowProvider` in `src/lib/store.tsx`. Resets on page reload. |
| Loading state timing and skeletons | **Real UI**, **mocked timing** | Fixed ~1.5s delay; no actual signal scan. |
| Save flow (overlay, success, error modal, draft) | **Real UI**, **mocked backend** | No network call; error state is triggered by an in-UI toggle. |
| AI suggestions (next step, objection, follow-up, health, 92% confidence) | **Mocked / scripted** | Hard-coded copy chosen to make the usability test unambiguous. |
| Source signals (call notes, email excerpts) | **Mocked** | Static example content. |
| Manager view metrics | **Mocked** | Illustrative numbers; not connected to a data source. |
| Auth, user accounts, permissions | **Not built** | Out of scope for the prototype. |
| CRM integration (Salesforce / HubSpot / internal CRM) | **Not built** | No real read/write. |
| LLM call | **Not built** | No model is invoked; suggestions are static. |
| Database / persistence | **Not built** | Lovable Cloud not enabled; state is in-memory only. |
| Email / calendar / Slack signal ingestion | **Not built** | Implied by the UI, not implemented. |

---

## 9. Out of Scope (Prototype)

- Building a full CRM (accounts, contacts, opportunities CRUD).
- Authentication, roles, and permissions.
- Real integrations with Salesforce, HubSpot, Gmail, Outlook, Gong, Slack.
- A real LLM-backed suggestion engine.
- Admin/settings, billing, onboarding flows.
- Mobile layouts beyond responsive shrink of the existing screens.

---

## 10. Success Criteria for the Prototype Test

The prototype is successful if, in moderated usability sessions, reps:
1. Complete the Acme Logistics golden path in **under 60 seconds** end-to-end.
2. Self-report higher confidence and lower friction vs. the existing CRM.
3. Articulate, unprompted, that the AI assistant "saves time" or "tells me what to do next."

Managers viewing `/team` should be able to describe the adoption + forecast-confidence link without explanation from the moderator.
