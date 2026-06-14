# Outcome Model — FlowCRM AI Workspace

---

## The Hypothesis Chain

```
INPUT SIGNAL:
Reps already have deal information in call notes, email, and calendar
          ↓
AI INTERVENTION:
Read those signals → draft CRM field updates with evidence → surface a prioritized worklist
          ↓
BEHAVIORAL CHANGE:
CRM updates take under 2 minutes instead of 10+ minutes
Reps experience the CRM as a selling tool, not a compliance requirement
          ↓
LEADING METRICS:
AI suggestion acceptance rate ≥60%
Average CRM update time ≤2 minutes
          ↓
LAGGING METRICS:
Weekly active CRM adoption: 18% → 45% in 90 days
Missing next steps: 48% → below 40%
Shadow spreadsheet usage: 63% → below 40%
          ↓
BUSINESS OUTCOMES:
Forecast accuracy improves (managers trust CRM data)
Pipeline visibility improves (fewer "surprise" deal losses)
Manager time saved (no more chasing reps for manual updates)
```

---

## Metric Definitions

**Weekly active adoption rate** — percentage of licensed users who log at least one CRM action in a 7-day window. Current baseline: 18%. Target: 45% in 90 days.

**AI suggestion acceptance rate** — percentage of AI-drafted updates that reps accept (unmodified or after editing) vs. reject. The prototype simulates 72%; the real threshold for a productive system is ≥60%.

**Average CRM update time** — time from clicking "Fix with AI" to completing a deal update. Baseline: multi-minute manual entry. Prototype targets ≤2 minutes for the AI-assisted path.

**Missing next steps** — percentage of open deals with no next step logged. Baseline: 48%. Each accepted AI update that adds a next step moves this metric.

**Shadow spreadsheet usage** — percentage of reps maintaining deal tracking outside the CRM. Baseline: 63%. This is the signal that reps have a genuine unmet need, not a training gap.

---

## Instrumentation Plan

For a real deployment, measure:
1. **Session funnel:** Dashboard → Workspace → Assistant → Accept (per user, per week)
2. **Acceptance rate by deal type:** Do reps accept more readily for certain deal stages or signal types?
3. **Edit rate:** How often do reps modify before accepting? What fields get changed most?
4. **Rejection reasons:** Why do reps reject? (Confidence, relevance, incorrect suggestion)
5. **Time-to-update:** Measured from "Fix with AI" click to successful save

---

## What the Prototype Proves

The prototype tests two sub-hypotheses:
1. **Clarity:** Do reps understand the evidence-to-recommendation flow? Can they tell why the AI made a suggestion?
2. **Speed:** Is the AI-assisted path faster and more comfortable than the current manual path?

If reps complete the golden path in under 30 seconds and express confidence in the suggestion, the core product concept is validated for a production build.
