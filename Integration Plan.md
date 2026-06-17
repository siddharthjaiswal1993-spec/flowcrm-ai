# FlowCRM AI Workspace — Integration Plan

This plan is based on the current `flowcrm-ai` codebase and the live FlowCRM prototype. It focuses on what actually exists today, what is still hardcoded, and what should be moved into Supabase-backed data for the next integration phase.

---

## Section 1: M4 Status Check

| Item | Actual Status |
|---|---|
| How many screens this prototype has | **6 product screens**: Adoption Diagnostic Dashboard (`/`), Role-Based Workspace (`/workspace`), AI Assistant Loading (`/assistant-loading`), AI Assistant Recommendation Review (`/assistant`), AI Assistant Empty Signals (`/assistant-error`), Manager View (`/team`). There is also a separate Auth screen (`/auth`), so the app has **7 routed screens total**. |
| Whether a Living PRD or product requirements document exists | **Yes.** `PRD.md` exists and defines the product, screens, user flows, hypothesis, metrics, mocked vs. real map, and success criteria. |
| Whether the code uses clean, descriptive variable and function names | **Mostly yes.** Examples: `AdoptionDiagnosticDashboard`, `RoleBasedWorkspace`, `AssistantRecommendationReview`, `AssistantEmptySignalsScreen`, `getDashboardMetrics`, `listMyDeals`, `getDealByAccount`, `acceptSuggestion`, `seedDemoData`, `resetDemoData`. |
| Whether GitHub is connected | **Yes.** The active repo is `siddharthjaiswal1993-spec/flowcrm-ai`. |
| Whether Supabase or a database backend is connected | **Yes.** Supabase is connected through `src/integrations/supabase/client.ts`, `auth-middleware.ts`, generated `types.ts`, and server functions in `src/lib/deals.functions.ts`. |

---

## Section 2: Data Audit — What's Still Hardcoded?

| Screen / Component | Hardcoded Value | What It Should Query |
|---|---|---|
| `src/features/dashboard/data.ts` | Workflow blockers: “Too many required fields”, “No clear daily priority view”, “CRM updates feel like management reporting”, “Users already work in spreadsheets and email”, “Data is stale, so managers don't trust it” | Query `workflow_insights` where `type = 'blocker'`, ordered by `display_order`. |
| `src/features/dashboard/data.ts` | Voice-of-user quote: “It's faster to keep my deals in a spreadsheet than to fight the CRM's eight required fields.” | Query `workflow_insights` where `type = 'user_quote'`, with `text` and `attribution`. |
| `src/features/dashboard/data.ts` | Voice-of-user attribution: “Account Executive · 2 logins/month” | Query `workflow_insights.attribution`. |
| `src/features/dashboard/data.ts` | Voice-of-user quote: “I never know where the thing I need lives. Every screen looks like a settings page.” | Query `workflow_insights` where `type = 'user_quote'`. |
| `src/features/dashboard/data.ts` | Voice-of-user attribution: “Sales Rep · onboarded but inactive” | Query `workflow_insights.attribution`. |
| `src/features/dashboard/data.ts` | Voice-of-user quote: “Logging activity feels like data entry for management, not something that helps me sell.” | Query `workflow_insights` where `type = 'user_quote'`. |
| `src/features/dashboard/data.ts` | Voice-of-user attribution: “Senior AE” | Query `workflow_insights.attribution`. |
| `src/features/dashboard/data.ts` | Voice-of-user quote: “If it could just tell me who to call next, I'd open it every morning.” | Query `workflow_insights` where `type = 'user_quote'`. |
| `src/features/dashboard/data.ts` | Voice-of-user attribution: “SDR · occasional user” | Query `workflow_insights.attribution`. |
| `src/features/dashboard/data.ts` | AI shortcut: “Fix 3 stale deals with AI” | Query count from `deals` where `status in ('Stale', 'At risk')`, then render a dynamic recommendation from `workflow_insights` or `dashboard_recommendations`. |
| `src/features/dashboard/data.ts` | AI shortcut: “Add next steps to 5 deals” | Query count from `deals` where `problem ilike '%next step%'`. |
| `src/features/dashboard/data.ts` | AI shortcut: “Review 23 AI suggestions” | Query count from `ai_suggestions` where `status in ('pending', 'draft')`. |
| `AdoptionDiagnosticDashboard.tsx` | Duplicate accounts: `17%` | Query `crm_health_snapshots.duplicate_accounts_pct` or calculate from a future `accounts` table by duplicate domain/name matching. |
| `AdoptionDiagnosticDashboard.tsx` | Fallback data quality: `54 / 100` when no data exists | Query `crm_health_snapshots.data_quality_score`, or calculate from `deals`, `signals`, and `ai_suggestions`. |
| `AdoptionDiagnosticDashboard.tsx` | Right panel copy: “Your CRM adoption is low because users don't get immediate workflow value…” | Query `workflow_insights` where `type = 'assistant_summary'`. |
| `AdoptionDiagnosticDashboard.tsx` | Seed banner copy: “Seed 4 demo deals…” | Keep as prototype copy or move to `app_copy` if this remains configurable. |
| `src/lib/deals.functions.ts` | Seed deal: Acme Logistics, Proposal, `$84,000`, Missing next step, Stale, 18 days stale | Already seeded into `deals`, but seed data is hardcoded. Replace with admin-created demo data or a `demo_seed_templates` table. |
| `src/lib/deals.functions.ts` | Seed deal: Northstar Retail, Negotiation, `$126,000`, No decision-maker mapped, At risk, 9 days stale | Replace with data from `deals` created through real CRM sync or admin seed import. |
| `src/lib/deals.functions.ts` | Seed deal: BluePeak Software, Discovery, `$52,000`, Follow-up due today, Active, 3 days stale | Replace with data from `deals` created through real CRM sync or admin seed import. |
| `src/lib/deals.functions.ts` | Seed deal: Vertex Manufacturing, Qualification, `$39,000`, Deal has no next step, Stale, 22 days stale | Replace with data from `deals` created through real CRM sync or admin seed import. |
| `src/lib/deals.functions.ts` | Acme signals: call note, email snippet, CRM history | Already seeded into `signals`, but source examples are hardcoded. Replace with real signal ingestion into `signals`. |
| `src/lib/deals.functions.ts` | Northstar signal: “Looping in CFO for final approval.” | Replace with real ingested email/call signal in `signals`. |
| `src/lib/deals.functions.ts` | BluePeak signal: “VP Sales requested live demo for next week.” | Replace with real ingested meeting/call signal in `signals`. |
| `src/features/workspace/data.ts` | Customer Success item: “Helix Health · QBR overdue” | Query future `cs_accounts` or `account_health_signals` table. |
| `src/features/workspace/data.ts` | Customer Success item: “Orbit Media · usage dropped 31%” | Query future `account_health_signals` with usage trend metrics. |
| `src/features/workspace/data.ts` | Customer Success item: “Pinecone Foods · NPS detractor” | Query future `account_health_signals` with NPS/customer feedback fields. |
| `src/features/workspace/data.ts` | Manager item: “SMB Sales adoption stuck at 15%” | Query `team_metrics.adoption_pct` for the SMB Sales team. |
| `src/features/workspace/data.ts` | Manager item: “Forecast confidence at 41%” | Query `crm_health_snapshots.forecast_confidence_pct`. |
| `src/features/workspace/data.ts` | Manager item: “9 deals over $50k with no next step” | Query `deals` where `value > 50000` and `problem ilike '%next step%'`. |
| `RoleBasedWorkspace.tsx` | Header fallback owner: “there” | Query `profiles.full_name`; fallback should be “there” only if profile is missing. |
| `RoleBasedWorkspace.tsx` | Static role tabs: Sales Rep, Customer Success, Manager | Query from `user_roles.role` and feature access config, or keep static if all users see all demo tabs. |
| `RoleBasedWorkspace.tsx` | AI ready copy: “6 of 8 fields auto-fillable” | Query latest `ai_suggestions.auto_filled_fields` and `total_fields` for relevant pending suggestions. |
| `RoleBasedWorkspace.tsx` | Suggested text mapping for Acme: “Schedule pricing review call for Friday” | Query `ai_suggestions.next_step` for the deal. |
| `RoleBasedWorkspace.tsx` | Suggested text mapping for Northstar: “Add CFO as economic buyer” | Query `ai_suggestions.next_step`, or generate from `signals`. |
| `RoleBasedWorkspace.tsx` | Suggested text mapping for BluePeak: “Send demo scheduling email” | Query `ai_suggestions.next_step`, or generate from `signals`. |
| `RoleBasedWorkspace.tsx` | Suggested text mapping for Vertex: “Send re-engagement email” | Query `ai_suggestions.next_step` if available; otherwise show empty-signals state from `signals.count = 0`. |
| `RoleBasedWorkspace.tsx` | Signal mapping labels for deals | Query `signals.source_label` and `signals.content`; summarize most relevant signal. |
| `src/features/assistant/data.ts` | `acmeSignals` array | Mostly obsolete because `/assistant` now queries `signals`; remove unused static copy or use only as fallback seed template. |
| `src/features/assistant/data.ts` | Suggested defaults: next step, objection, follow-up, health | Query `ai_suggestions.next_step`, `objection`, `follow_up`, `health`, or generate from an AI suggestion service. |
| `src/features/assistant/data.ts` | Vertex missing sources: “0 in last 30 days”, “22 days stale” | Query `signals` count by kind and `deals.last_activity_at`. |
| `src/features/assistant/data.ts` | Loading steps: “Pulled deal history (18 days)”, “Scanned 2 call notes”, “Reading 4 emails…” | Query actual signal counts from `signals` and/or store analysis progress in `ai_analysis_runs.loading_steps`. |
| `src/features/assistant/data.ts` | `LOADING_DURATION_MS = 1500` | UI timing can remain constant, or read from app config if needed. |
| `src/features/assistant/data.ts` | `SAVE_DURATION_MS = 1400` | UI timing can remain constant, or remove when save is tied to real network latency. |
| `AssistantRecommendationReview.tsx` | Account constant: `Acme Logistics` | Read account/deal id from route params, e.g. `/assistant/$dealId`, then query `getDealById`. |
| `AssistantRecommendationReview.tsx` | Confidence label: “AI confidence: High” | Query `ai_suggestions.confidence` and map numeric confidence to label. |
| `AssistantRecommendationReview.tsx` | Reasoning copy: “Pricing concern was found in both call notes and email…” | Add `ai_suggestions.reasoning` or `ai_analysis_runs.reasoning`. |
| `AssistantRecommendationReview.tsx` | Auto-fill text: “6 of 8 fields…” | Query `ai_suggestions.auto_filled_fields` and `total_fields`; store field names in `ai_suggestions.auto_filled_field_names jsonb`. |
| `AssistantRecommendationReview.tsx` | Impact preview items | Query from suggestion + deal state, or generate from `ai_suggestions.impact_preview jsonb`. |
| `AssistantRecommendationReview.tsx` | Save error copy: “The CRM connection timed out.” | Keep as error handling copy, but actual error should come from failed mutation/network exception. |
| `src/features/team/data.ts` | Team row: Enterprise Sales, adoption 22, reps 48 | Query `team_metrics` by team and period. |
| `src/features/team/data.ts` | Team row: SMB Sales, adoption 15, reps 62 | Query `team_metrics` by team and period. |
| `src/features/team/data.ts` | Team row: Customer Success, adoption 31, reps 41 | Query `team_metrics` by team and period. |
| `src/features/team/data.ts` | Team row: Account Management, adoption 19, reps 34 | Query `team_metrics` by team and period. |
| `src/features/team/data.ts` | Team row: RevOps, adoption 64, reps 12 | Query `team_metrics` by team and period. |
| `src/features/team/data.ts` | Adoption insights: “61% of records…”, “48%…”, “63%…”, “11 minutes to under 2 minutes” | Query `workflow_insights` where `type = 'manager_insight'`, with dynamic metric placeholders resolved from `crm_health_snapshots` and `team_metrics`. |
| `ManagerView.tsx` | CRM adoption KPI: `18%` | Query `crm_health_snapshots.crm_adoption_pct`. |
| `ManagerView.tsx` | Forecast confidence copy: `41%` to `68%` | Query `crm_health_snapshots.forecast_confidence_pct` and `forecast_confidence_target_pct`. |
| `ManagerView.tsx` | Manager action buttons: Review adoption gaps, Send smart nudges, Export adoption summary | Query `manager_actions` or keep static if actions are product-level constants. |
| `AppLayout.tsx` | Header avatar initials: `RS` | Query `profiles.full_name` and derive initials. |
| `AppLayout.tsx` | Search placeholder: “Search deals, accounts, contacts…” | Keep as UI copy, or move to `app_copy` if localized/configurable. |
| `AppLayout.tsx` | Sidebar version: `v0.4 · Prototype` | Move to app config or package metadata. |
| `__root.tsx` | Metadata title: `Lovable App`; author: `Lovable` | Replace with FlowCRM-specific metadata from app config. |

---

## Section 3: Schema Design

### Current database tables from M4

#### Existing: `profiles`

| Field | Type | Purpose |
|---|---|---|
| `id` | uuid | User id, aligned with Supabase Auth user id. |
| `full_name` | text | Display name for the signed-in user. |
| `email` | text | User email address. |
| `team` | text | User's team name. |
| `created_at` | timestamp | Record creation time. |
| `updated_at` | timestamp | Last profile update time. |

#### Existing: `user_roles`

| Field | Type | Purpose |
|---|---|---|
| `id` | uuid | Role assignment id. |
| `user_id` | uuid | User receiving the role. |
| `role` | text / enum | App role: `rep`, `manager`, or `admin`. |

#### Existing: `deals`

| Field | Type | Purpose |
|---|---|---|
| `id` | uuid | Deal id. |
| `account` | text | Account or company name. |
| `stage` | text | Sales stage, e.g. Proposal, Negotiation. |
| `value` | int | Deal value. |
| `status` | text / enum | Deal status: `Stale`, `At risk`, `Active`, `Updated`. |
| `problem` | text | Current problem or reason the deal needs attention. |
| `owner_id` | uuid | Rep/user who owns the deal. |
| `last_activity_at` | timestamp | Last recorded activity time. |
| `created_at` | timestamp | Record creation time. |
| `updated_at` | timestamp | Last deal update time. |

#### Existing: `signals`

| Field | Type | Purpose |
|---|---|---|
| `id` | uuid | Signal id. |
| `deal_id` | uuid | Related deal. |
| `kind` | text / enum | Signal type: `call`, `email`, `crm`, or `meeting`. |
| `source_label` | text | Human-readable source label. |
| `content` | text | Extracted signal content. |
| `occurred_at` | timestamp | When the source signal occurred. |
| `created_at` | timestamp | When the signal was stored. |

#### Existing: `ai_suggestions`

| Field | Type | Purpose |
|---|---|---|
| `id` | uuid | AI suggestion id. |
| `deal_id` | uuid | Related deal. |
| `next_step` | text | Suggested next step. |
| `objection` | text | Suggested objection to capture. |
| `follow_up` | text | Suggested follow-up task. |
| `health` | text | Suggested deal health. |
| `confidence` | int | Numeric confidence score. Current generated type is number; recommended DB type can remain numeric/int based on implementation. |
| `auto_filled_fields` | int | Number of fields the AI can fill. |
| `total_fields` | int | Total required fields. |
| `status` | text / enum | Suggestion status: `pending`, `accepted`, `edited`, `rejected`, `draft`. |
| `reviewed_by` | uuid | User who reviewed the suggestion. |
| `reviewed_at` | timestamp | Review time. |
| `created_at` | timestamp | Created time. |
| `updated_at` | timestamp | Updated time. |

### Existing enum values

| Enum | Values |
|---|---|
| `app_role` | `rep`, `manager`, `admin` |
| `deal_status` | `Stale`, `At risk`, `Active`, `Updated` |
| `signal_kind` | `call`, `email`, `crm`, `meeting` |
| `suggestion_status` | `pending`, `accepted`, `edited`, `rejected`, `draft` |

---

### Proposed schema additions

#### New: `crm_health_snapshots`

Purpose: Replace hardcoded dashboard and manager KPIs with period-based CRM health metrics.

| Field | Type | Purpose |
|---|---|---|
| `id` | uuid | Snapshot id. |
| `team` | text | Optional team scope; null can mean overall workspace/org. |
| `period_start` | timestamp | Start of reporting period. |
| `period_end` | timestamp | End of reporting period. |
| `crm_adoption_pct` | int | Weekly active adoption percentage. |
| `weekly_active_users` | int | Active users in the period. |
| `licensed_users` | int | Total licensed/eligible users. |
| `avg_update_time_minutes` | int | Average time to complete CRM update. |
| `target_update_time_minutes` | int | Target time for comparison. |
| `shadow_spreadsheet_usage_pct` | int | Percent of reps using shadow spreadsheets. |
| `internal_csat_score` | int | CRM CSAT score scaled as integer if desired, or use numeric in implementation. |
| `duplicate_accounts_pct` | int | Duplicate account rate. |
| `data_quality_score` | int | Composite data quality score. |
| `forecast_confidence_pct` | int | Current forecast confidence. |
| `forecast_confidence_target_pct` | int | Target or modeled forecast confidence. |
| `time_saved_hours` | int | Time saved during period, preferably numeric if fractional display is required. |
| `created_at` | timestamp | Record creation time. |

#### New: `team_metrics`

Purpose: Replace hardcoded team adoption rows in Manager View.

| Field | Type | Purpose |
|---|---|---|
| `id` | uuid | Team metric id. |
| `team_name` | text | Team name, e.g. Enterprise Sales. |
| `period_start` | timestamp | Start of reporting period. |
| `period_end` | timestamp | End of reporting period. |
| `adoption_pct` | int | Weekly active adoption percentage. |
| `rep_count` | int | Number of reps on that team. |
| `stale_records_count` | int | Count of stale records for the team. |
| `missing_next_steps_count` | int | Count of deals missing next steps for the team. |
| `created_at` | timestamp | Record creation time. |

#### New: `workflow_insights`

Purpose: Replace hardcoded blockers, user quotes, manager insights, AI summaries, and recommended shortcuts.

| Field | Type | Purpose |
|---|---|---|
| `id` | uuid | Insight id. |
| `type` | text | Insight type: `blocker`, `user_quote`, `manager_insight`, `assistant_summary`, `shortcut`. |
| `text` | text | Main copy. |
| `attribution` | text | Optional quote attribution, e.g. Senior AE. |
| `team` | text | Optional team scope. |
| `display_order` | int | Display sort order. |
| `is_active` | boolean | Whether insight is visible. |
| `metadata` | jsonb | Optional dynamic placeholders or source information. |
| `created_at` | timestamp | Record creation time. |
| `updated_at` | timestamp | Last update time. |

#### New: `ai_analysis_runs`

Purpose: Track AI analysis attempts, loading/empty/error states, confidence, reasoning, and source quality.

| Field | Type | Purpose |
|---|---|---|
| `id` | uuid | Analysis run id. |
| `deal_id` | uuid | Deal being analyzed. |
| `user_id` | uuid | User who initiated the analysis. |
| `status` | text | `loading`, `completed`, `empty_signals`, `failed`. |
| `reviewed_source_count` | int | Number of signals reviewed. |
| `confidence` | int | AI confidence score as percentage. |
| `reasoning` | text | Explanation shown to the user. |
| `loading_steps` | jsonb | UI progress steps if retained. |
| `error_message` | text | Error or empty-state reason. |
| `created_at` | timestamp | Start time. |
| `completed_at` | timestamp | Completion time. |

#### New: `manager_actions`

Purpose: Replace static Manager View action buttons and support future action logging.

| Field | Type | Purpose |
|---|---|---|
| `id` | uuid | Action id. |
| `label` | text | Button label, e.g. Send smart nudges. |
| `action_type` | text | `review_gaps`, `send_nudges`, `export_summary`. |
| `role_required` | text | Minimum role required, e.g. `manager` or `admin`. |
| `is_active` | boolean | Whether action is available. |
| `created_at` | timestamp | Record creation time. |

#### New: `app_config`

Purpose: Replace small app-level hardcoded values such as version, product title, metadata, and fallback copy.

| Field | Type | Purpose |
|---|---|---|
| `id` | uuid | Config row id. |
| `key` | text | Config key, e.g. `app_version`, `meta_title`. |
| `value` | text | Config value. |
| `metadata` | jsonb | Optional structured config. |
| `created_at` | timestamp | Record creation time. |
| `updated_at` | timestamp | Last update time. |

### Proposed field additions to existing tables

#### Existing table update: `deals`

| Field | Type | Purpose |
|---|---|---|
| `next_step` | text | Persisted next step after acceptance. |
| `objection` | text | Persisted objection or risk captured from AI suggestion. |
| `follow_up` | text | Persisted follow-up task or task summary. |
| `health` | text | Deal health, e.g. At risk, Healthy, Stalled. |
| `required_fields_completed` | int | Number of completed CRM fields. |
| `total_required_fields` | int | Total required CRM fields. |

#### Existing table update: `ai_suggestions`

| Field | Type | Purpose |
|---|---|---|
| `reasoning` | text | Human-readable explanation for why the suggestion was made. |
| `source_signal_ids` | jsonb | List of signal ids used to produce the suggestion. |
| `impact_preview` | jsonb | Structured impact bullets shown before acceptance. |
| `auto_filled_field_names` | jsonb | Names of fields that AI can fill. |
| `save_error_message` | text | Last save error, if save failed. |

#### Existing table update: `profiles`

| Field | Type | Purpose |
|---|---|---|
| `avatar_initials` | text | Optional cached initials for header/avatar display. |
| `manager_id` | uuid | Optional manager relationship for team-level access. |

---

## Section 4: Auth Model & Permissions

### Current auth model

The app already has Supabase Auth integration and a dedicated `/auth` screen with email/password and Google sign-in. Server functions use `requireSupabaseAuth`, which requires a bearer token and injects `supabase`, `userId`, and claims into server function context.

### Roles

| Role | Exists today? | What the role can see and do |
|---|---:|---|
| `rep` | Yes, in `app_role` enum | Can see their own profile, their own deals, related signals, and their own AI suggestions. Can seed/reset demo data for their own account in prototype mode. Can accept/edit/reject suggestions on their own deals. |
| `manager` | Yes, in `app_role` enum | Can see team-level dashboard and Manager View metrics for their team. Should be able to see deals and suggestions owned by reps on their team. Can trigger manager actions like Send Smart Nudges and Export Adoption Summary. |
| `admin` | Yes, in `app_role` enum | Can see and manage all users, teams, deals, metrics, workflow insights, and configuration. Can assign roles and manage seed/config data. |

### Recommended Row-Level Security rules

| Table | RLS policy |
|---|---|
| `profiles` | Users can read/update their own profile. Managers can read profiles where `profiles.team` equals the manager's team. Admins can read/update all profiles. |
| `user_roles` | Users may read their own role. Only admins can insert/update/delete roles. Avoid recursive role checks by using the existing `has_role(_user_id, _role)` security definer function. |
| `deals` | Reps can CRUD only deals where `owner_id = auth.uid()`. Managers can read/update deals owned by users on their team. Admins can read/update all deals. |
| `signals` | Access should be inherited from the related `deals` row. If the user can access the deal, they can access its signals. |
| `ai_suggestions` | Access should be inherited from the related `deals` row. Reps can accept/edit/reject suggestions for their own deals. Managers can read team suggestions. Admins can read/manage all suggestions. |
| `crm_health_snapshots` | Reps can read only personal/team-safe aggregate snapshots. Managers can read snapshots for their team. Admins can read/write all snapshots. |
| `team_metrics` | Managers can read metrics for their own team. Admins can read/write all team metrics. Reps should not see other team data unless intentionally exposed as aggregate. |
| `workflow_insights` | All authenticated users can read active insights. Admins can insert/update/delete. |
| `ai_analysis_runs` | Access inherited from related deal. Reps can see runs they initiated for their own deals. Managers can see team runs. Admins can see all. |
| `manager_actions` | Managers and admins can read. Admins can insert/update/delete. Action execution should be role-gated. |
| `app_config` | All authenticated users can read safe public config. Admins can write. |

---

## Section 5: Prompts

### Prompt 1 — Schema Expansion

```text
You are working in the FlowCRM AI Workspace codebase.

Goal: extend the existing Supabase schema and replace hardcoded UI values with database-backed queries.

Current existing tables from generated Supabase types:
- profiles
- user_roles
- deals
- signals
- ai_suggestions

Current important files:
- src/features/dashboard/AdoptionDiagnosticDashboard.tsx
- src/features/dashboard/data.ts
- src/features/workspace/RoleBasedWorkspace.tsx
- src/features/workspace/data.ts
- src/features/assistant/AssistantRecommendationReview.tsx
- src/features/assistant/AssistantEmptySignalsScreen.tsx
- src/features/assistant/data.ts
- src/features/team/ManagerView.tsx
- src/features/team/data.ts
- src/lib/deals.functions.ts
- src/integrations/supabase/types.ts

Create a Supabase migration that adds these new tables:

1. crm_health_snapshots
Fields:
- id uuid primary key default gen_random_uuid()
- team text nullable
- period_start timestamp with time zone not null
- period_end timestamp with time zone not null
- crm_adoption_pct int not null default 18
- weekly_active_users int not null default 42
- licensed_users int not null default 230
- avg_update_time_minutes int not null default 11
- target_update_time_minutes int not null default 2
- shadow_spreadsheet_usage_pct int not null default 63
- internal_csat_score int not null default 21
- duplicate_accounts_pct int not null default 17
- data_quality_score int not null default 54
- forecast_confidence_pct int not null default 41
- forecast_confidence_target_pct int not null default 68
- time_saved_hours int not null default 0
- created_at timestamp with time zone default now()

2. team_metrics
Fields:
- id uuid primary key default gen_random_uuid()
- team_name text not null
- period_start timestamp with time zone not null
- period_end timestamp with time zone not null
- adoption_pct int not null
- rep_count int not null
- stale_records_count int not null default 0
- missing_next_steps_count int not null default 0
- created_at timestamp with time zone default now()

3. workflow_insights
Fields:
- id uuid primary key default gen_random_uuid()
- type text not null
- text text not null
- attribution text nullable
- team text nullable
- display_order int not null default 0
- is_active boolean not null default true
- metadata jsonb not null default '{}'::jsonb
- created_at timestamp with time zone default now()
- updated_at timestamp with time zone default now()

4. ai_analysis_runs
Fields:
- id uuid primary key default gen_random_uuid()
- deal_id uuid not null references deals(id) on delete cascade
- user_id uuid not null
- status text not null
- reviewed_source_count int not null default 0
- confidence int nullable
- reasoning text nullable
- loading_steps jsonb not null default '[]'::jsonb
- error_message text nullable
- created_at timestamp with time zone default now()
- completed_at timestamp with time zone nullable

5. manager_actions
Fields:
- id uuid primary key default gen_random_uuid()
- label text not null
- action_type text not null
- role_required text not null default 'manager'
- is_active boolean not null default true
- created_at timestamp with time zone default now()

6. app_config
Fields:
- id uuid primary key default gen_random_uuid()
- key text not null unique
- value text not null
- metadata jsonb not null default '{}'::jsonb
- created_at timestamp with time zone default now()
- updated_at timestamp with time zone default now()

Alter existing tables:
- deals: add next_step text, objection text, follow_up text, health text, required_fields_completed int default 2, total_required_fields int default 8
- ai_suggestions: add reasoning text, source_signal_ids jsonb default '[]'::jsonb, impact_preview jsonb default '[]'::jsonb, auto_filled_field_names jsonb default '[]'::jsonb, save_error_message text
- profiles: add avatar_initials text, manager_id uuid nullable

Seed the new tables with the current hardcoded prototype values:
- workflow blockers from src/features/dashboard/data.ts
- voice-of-user quotes from src/features/dashboard/data.ts
- AI shortcuts from src/features/dashboard/data.ts
- manager insights from src/features/team/data.ts
- team metrics from src/features/team/data.ts
- CRM health baseline values: 18% adoption, 42 weekly active users, 230 licensed users, 11 min update time, 2 min target, 63% shadow spreadsheet usage, 2.1/5 CSAT represented as 21, 17% duplicate accounts, 54 data quality score, 41% forecast confidence, 68% target forecast confidence
- manager actions: Review adoption gaps, Send smart nudges, Export adoption summary
- app config: app_version = v0.4 Prototype, product_name = FlowCRM AI Workspace, meta_title = FlowCRM AI Workspace

Then update the UI and server functions:
- Replace workflowBlockers, voiceOfUser, and aiSuggestionShortcuts in src/features/dashboard/data.ts with database queries.
- Replace teams and adoptionInsights in src/features/team/data.ts with database queries.
- Replace hardcoded Duplicate accounts 17%, CRM adoption 18%, forecast confidence 41% to 68%, and fallback data quality 54 with values from crm_health_snapshots.
- Replace AppLayout avatar initials RS with initials derived from profiles.full_name or profiles.avatar_initials.
- Replace AssistantRecommendationReview hardcoded ACCOUNT = 'Acme Logistics' with a route param-based deal lookup if possible, or clearly isolate it as demo-only if route params are too large for this change.
- Replace assistant reasoning, confidence label, impact preview, auto-filled field names, and default suggested fields with ai_suggestions columns.

Keep the existing golden path working:
Dashboard → Review today's CRM priorities → Workspace → Fix with AI on Acme Logistics → Assistant Loading → Assistant Review → Accept AI Update → Dashboard with updated state.

Do not remove the demo seed flow. Extend it so it also seeds the new metrics and insight tables for demo users.
```

### Prompt 2 — Auth UI + Row-Level Security

```text
You are working in the FlowCRM AI Workspace codebase.

Goal: finish the auth, user identity, role-based access, and RLS model using the existing Supabase integration.

Current auth-related files:
- src/routes/auth.tsx
- src/components/AppLayout.tsx
- src/integrations/supabase/client.ts
- src/integrations/supabase/auth-middleware.ts
- src/integrations/supabase/types.ts
- src/lib/deals.functions.ts

Current existing roles:
- app_role enum: rep, manager, admin
- user_roles table
- has_role(_user_id, _role) function exists in generated Supabase types

Implement the following:

1. Improve the existing /auth screen
- Keep email/password sign in.
- Keep Google sign-in.
- On signup, collect full_name and optional team.
- After signup, create or update profiles with id = auth.uid(), full_name, email, team, avatar_initials.
- Assign new users the rep role by default in user_roles unless a role already exists.
- Preserve current inline error behavior and user input on failure.

2. Protect all app routes
- If no active session exists, redirect from /, /workspace, /assistant-loading, /assistant, /assistant-error, and /team to /auth.
- Show message: “Your session expired. Please sign in to continue.” when redirected because of expiry or missing auth.
- Keep /auth public.

3. Header identity
- Update AppLayout to query the logged-in user's profile.
- Show the user's real initials instead of hardcoded RS.
- Show the user's full name or first name in the header if space allows.
- Keep the existing logout button and ensure logout clears React Query cache, signs out of Supabase, and redirects to /auth.

4. Role-based navigation
- rep: can see Dashboard, My CRM Work, AI Assistant. Team Adoption can be hidden or read-only if exposed.
- manager: can see Dashboard, My CRM Work, AI Assistant, Team Adoption.
- admin: can see all current screens and future admin/config screens.
- Keep inactive nav items Accounts, Deals, and Data Quality visually disabled unless they are implemented.

5. Add or verify RLS policies
Use the existing roles and has_role function.

profiles:
- Users can select/update their own profile.
- Managers can select profiles for users on their team.
- Admins can select/update all profiles.

user_roles:
- Users can select their own role.
- Admins can select/insert/update/delete all roles.
- Do not allow reps to self-promote.

deals:
- Reps can select/insert/update/delete deals where owner_id = auth.uid().
- Managers can select/update deals owned by users on their team.
- Admins can select/update/delete all deals.

signals:
- Users can access signals only when they can access the related deals row.
- Admins can manage all signals.

ai_suggestions:
- Users can access suggestions only when they can access the related deals row.
- Reps can accept/edit/reject suggestions for their own deals.
- Managers can read team suggestions.
- Admins can manage all suggestions.

crm_health_snapshots:
- Reps can read non-sensitive aggregate or their own team snapshot only.
- Managers can read their team snapshot.
- Admins can manage all snapshots.

team_metrics:
- Managers can read their own team metrics.
- Admins can manage all team metrics.

workflow_insights:
- All authenticated users can read active insights.
- Admins can manage insights.

ai_analysis_runs:
- Access inherited from deals.
- Reps can create runs for their own deals.
- Managers can read team runs.
- Admins can manage all.

manager_actions:
- Managers and admins can read active actions.
- Admins can manage actions.

app_config:
- Authenticated users can read safe app config.
- Admins can manage config.

6. Different users see different data
- Confirm that listMyDeals queries only deals owned by the signed-in user for reps.
- Managers should see team-level aggregate data in /team.
- Admins should be able to view all data if admin-specific flows are added later.

Keep the existing FlowCRM visual style: soft white/grey background, deep navy text, calm blue primary actions, rounded cards, enterprise SaaS spacing.
```

### Prompt 3 — Edge Cases

```text
You are working in the FlowCRM AI Workspace codebase.

Goal: harden the entire app against real-world failure modes while preserving the existing screens, routes, and golden path.

Current key routes:
- / — Adoption Diagnostic Dashboard
- /workspace — Role-Based Workspace
- /assistant-loading — AI Assistant Loading
- /assistant — AI Assistant Recommendation Review
- /assistant-error — AI Assistant Empty Signals State
- /team — Manager View
- /auth — Auth screen

Implement edge case handling across the app:

1. Database connection failure
For every screen that fetches data using React Query or server functions:
- Dashboard: getDashboardMetrics, seedDemoData, resetDemoData
- Workspace: listMyDeals, seedDemoData
- Assistant: getDealByAccount, acceptSuggestion
- Team: getDashboardMetrics

Show an error card instead of a blank screen.
Message:
“Could not load CRM data.”
Supporting copy:
“Check your connection and try again.”
Button:
“Retry”
The Retry button should refetch the failed query or retry the failed mutation.

2. Empty data states
Dashboard:
- If the user has zero deals, keep the current Seed demo data state.
- Make the CTA clear: “Seed demo data.”

Workspace:
- If the user has zero deals, show the current empty state with Seed demo data CTA.
- Do not show an empty list.

Assistant:
- If Acme Logistics or the requested deal is not found, show:
“Deal not found.”
Supporting copy:
“Seed demo data or return to My CRM Work.”
Buttons:
“Seed demo data” and “Back to My CRM Work.”

Team:
- If no team metrics exist, show:
“No team adoption data yet.”
Supporting copy:
“Team metrics will appear after reps start using the CRM workspace.”

3. Form submission failure
Auth screen:
- Preserve email, password, and full name values after sign-in/sign-up failure.
- Show the Supabase error inline under the form.

Assistant edit modal:
- Preserve edited values if save fails.
- Show inline error near the action buttons:
“Could not save update. Your edits are still here.”

Accept AI Update:
- If acceptSuggestion fails, show the existing Save as Draft / Try Again / Cancel modal.
- Ensure user input is not lost.

4. Loading states
Add skeleton or loading states to every screen that fetches data:
- Dashboard: KPI skeleton cards while getDashboardMetrics is loading.
- Workspace: deal row skeletons while listMyDeals is loading.
- Assistant Loading: keep current AI analysis skeleton flow.
- Assistant Review: show a deal-detail skeleton while getDealByAccount is loading.
- Team: KPI and table skeletons while getDashboardMetrics or team metrics are loading.
- Auth: disable buttons and show spinner while sign-in, sign-up, or Google auth is pending.

5. Session expiry
- If Supabase session expires or server functions return Unauthorized, redirect to /auth.
- Show message:
“Your session expired. Please sign in to continue.”
- Do not show a root error boundary for normal auth expiry.

6. Product-specific edge cases
Empty signals:
- Keep Vertex Manufacturing path to /assistant-error.
- If a deal has no signals, never show a fabricated AI recommendation.
- Show manual CTA: “Create Manual Follow-up.”

Already accepted suggestion:
- If the latest suggestion status is accepted or edited, show the existing accepted-state banner.
- Disable or clearly label repeated acceptance as overwrite.

Double-click / repeated submit:
- Disable Accept AI Update while save mutation is pending.
- Prevent duplicate ai_suggestions inserts from spam clicks.
- Either debounce the button or make acceptSuggestion idempotent for the same deal and current pending suggestion.

Seed/reset conflicts:
- Disable Seed demo data and Reset demo data while their mutations are pending.
- After success, invalidate dashboard, workspace, and assistant queries.

Maintain the existing design language:
- rounded cards
- subtle borders
- calm blue primary actions
- clear status banners
- no blank screens
- no generic “Something went wrong” without a recovery action
```

---

## Section 6: Edge Case Checklist

- [ ] **Database connection failure** — Every data-fetching screen shows an error card with a Retry button instead of a blank screen.
- [ ] **Empty new-user experience** — A fresh user with zero deals sees a helpful Seed demo data CTA.
- [ ] **Form submission failure** — Auth and assistant edit forms preserve user input and show inline error messages.
- [ ] **Loading states** — Dashboard, workspace, assistant, team, and auth screens show skeletons/spinners while data loads.
- [ ] **Session expiry** — Expired or missing session redirects to `/auth` with a clear message.
- [ ] **Empty signals** — Deals with no call/email/CRM signals show the honest empty-signals state instead of fabricated AI output.
- [ ] **Already accepted suggestion** — Existing accepted/edited suggestions show a banner and avoid confusing duplicate acceptance.
- [ ] **Repeated submit / spam click** — `Accept AI Update` disables while saving and avoids duplicate suggestion inserts.
- [ ] **Seed demo data conflict** — Seed/reset buttons disable while pending and refetch dashboard/workspace after success.
- [ ] **Unauthorized role access** — Reps cannot see or mutate another rep's deals, signals, or suggestions.
- [ ] **Manager team isolation** — Managers only see team-level data for their own team unless they are admins.
- [ ] **Missing profile** — If `profiles` row is missing, show safe fallback display name and prompt profile completion.
- [ ] **Missing Supabase env vars** — App shows a clear setup error instead of crashing if Supabase variables are absent.
- [ ] **Deal not found** — Assistant screen handles missing Acme/requested deal with Seed demo data and Back to Workspace actions.
- [ ] **Save as Draft recovery** — Failed CRM save preserves the AI draft and gives the user recovery choices.

---

## Section 7: Stress Test Plan

### Stress Test 1: Offline During AI Save

**Purpose:** Test connection failure and save recovery.

**Steps:**
1. Sign in.
2. Seed demo data if needed.
3. Go to `/workspace`.
4. Click **Fix with AI** on Acme Logistics.
5. Wait for `/assistant`.
6. Turn browser/network offline or simulate save failure if the UI toggle exists.
7. Click **Accept AI Update**.

**Expected behavior:**
- User sees a clear save failure modal.
- Message explains that the CRM update could not be saved.
- User sees **Try Again**, **Save as Draft**, and **Cancel**.
- Edited values or AI suggestion are preserved.
- Dashboard metrics do not change unless the save succeeds.

### Stress Test 2: Fresh Signup With Zero Data

**Purpose:** Test empty/new user experience.

**Steps:**
1. Create a brand-new account through `/auth`.
2. Land on `/`.
3. Do not seed demo data immediately.
4. Navigate to `/workspace`, `/assistant`, and `/team`.

**Expected behavior:**
- Dashboard shows a helpful empty workspace message and **Seed demo data** CTA.
- Workspace shows no deals yet, not a blank list.
- Assistant shows deal-not-found guidance if Acme does not exist.
- Team view shows empty or aggregate metric guidance instead of fake team rows unless seeded.
- No app crash or root error boundary.

### Stress Test 3: Spam-Click Accept AI Update

**Purpose:** Test repeated actions and duplicate write prevention.

**Steps:**
1. Sign in and seed demo data.
2. Go through the Acme golden path.
3. On `/assistant`, rapidly click **Accept AI Update** multiple times.
4. If possible, click browser back and try accepting again.

**Expected behavior:**
- Button disables while the save mutation is pending.
- Only one accepted or edited suggestion is created for the action.
- Acme Logistics becomes `Updated` once.
- Dashboard metrics update once, not multiple times.
- If an accepted suggestion already exists, the UI clearly says the deal already has an accepted AI update.

---

## Section 8: Handoff Note

# FlowCRM AI Workspace — Handoff Note

## What's Real vs. What's Mocked

| Feature | Current State |
|---|---|
| Routing | **Real.** TanStack Start file-based routes for `/`, `/workspace`, `/assistant-loading`, `/assistant`, `/assistant-error`, `/team`, and `/auth`. |
| Authentication UI | **Real.** `/auth` supports email/password and Google sign-in. |
| Supabase client | **Real.** Supabase client and auth middleware exist. |
| User session handling | **Partial.** Auth state listener exists; full protected-route/session-expiry UX still needs hardening. |
| Deals data | **Real database-backed demo data.** Deals are stored in Supabase after seeding, but seed values are hardcoded in `deals.functions.ts`. |
| Signals data | **Real database-backed demo data.** Signals are stored in Supabase after seeding, but seed signal content is hardcoded. |
| AI suggestions | **Partly real.** Suggestions can be inserted into Supabase, but AI output is scripted, not generated by an LLM. |
| Dashboard metrics | **Partly real.** Some metrics are calculated from Supabase deals/suggestions; several adoption/business metrics remain hardcoded. |
| AI loading state | **Real UI, mocked timing.** Loading state is a timed UI sequence, not real signal analysis. |
| Assistant recommendation | **Real UI, scripted intelligence.** Evidence and suggestions are shown in a real screen, but AI reasoning is not model-generated. |
| Empty-signals state | **Real UI.** Vertex Manufacturing correctly routes to an empty-signals state. |
| Manager View | **Mixed.** Some pipeline values use dashboard metrics, but team adoption rows and insights are hardcoded. |
| Save failure state | **Real UI path.** Failure state exists in the assistant, but should be stress-tested against real mutation/network errors. |
| Full CRM integration | **Mocked / not built.** No Salesforce, HubSpot, or internal CRM write-back exists. |
| LLM integration | **Not built.** No model call is invoked. |

## Database Schema Summary

| Table | Summary |
|---|---|
| `profiles` | Stores user display profile, email, and team. |
| `user_roles` | Stores role assignments using `rep`, `manager`, and `admin`. |
| `deals` | Stores CRM deal records owned by users. |
| `signals` | Stores call/email/CRM/meeting evidence linked to deals. |
| `ai_suggestions` | Stores suggested or accepted CRM updates for deals. |
| `crm_health_snapshots` | Proposed table for dashboard and manager KPIs. |
| `team_metrics` | Proposed table for team adoption rows. |
| `workflow_insights` | Proposed table for blockers, quotes, insights, assistant summaries, and shortcuts. |
| `ai_analysis_runs` | Proposed table for analysis attempts, confidence, reasoning, empty-signals states, and failures. |
| `manager_actions` | Proposed table for manager action definitions. |
| `app_config` | Proposed table for metadata, version, and app-level copy. |

## Auth & RLS Model

| Role | Access Model |
|---|---|
| `rep` | Own profile, own deals, signals for own deals, suggestions for own deals. Can accept/edit/reject own suggestions. |
| `manager` | Team-level dashboards and metrics. Can read team profiles, team deals, team signals, and team suggestions. Can trigger manager actions. |
| `admin` | Full access to users, roles, deals, signals, suggestions, metrics, insights, and config. |

RLS should isolate per-user deal data through `deals.owner_id = auth.uid()` for reps, team matching for managers, and admin override through `has_role(auth.uid(), 'admin')`.

## Edge Cases Handled

_To be filled after the lab._

## Known Gaps

_To be filled after stress testing._

## Live URL

_To be filled after deployment._
