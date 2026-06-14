# AI Product Judgment — FlowCRM AI Workspace

---

## Decision 1: Evidence before recommendation, always

**What:** The AI Assistant screen shows source signals (call note, email excerpt, CRM history) before the AI-suggested field updates. The rep sees the evidence, then the recommendation — never the recommendation alone.

**Why:** A rep who accepts an AI suggestion they cannot verify is not adopting the product — they are rubber-stamping it. When the suggestion turns out to be wrong, they lose trust and stop accepting future suggestions.

Showing the evidence first inverts the trust dynamic: the rep validates the evidence, then decides whether the recommendation follows logically. This produces an interaction where the rep is genuinely in control, which is both better product design and the mechanism by which trust accumulates over time.

**What this reflects:** In sales contexts, AI suggestions are only acted on when the salesperson can explain them to their manager. If the rep cannot say "I accepted this because I had a call note and two emails confirming the pricing concern," the suggestion will not be acted on regardless of how accurate it is.

---

## Decision 2: One context switch, not zero

**What:** The golden path requires the rep to navigate from the worklist to a dedicated AI Assistant screen, review evidence, and explicitly accept. It does not accept updates inline on the worklist.

**Why:** Inline acceptance (one click to accept without seeing the evidence) would be faster but would train reps to accept without reviewing. That might work fine when the AI is right; it produces bad CRM data when the AI is wrong.

A dedicated screen with a deliberate review step is slightly more friction but produces a qualitatively different outcome: the rep has seen the evidence, the acceptance is informed, and the CRM data that results is data the rep has verified.

**What this reflects:** In AI product design, the right amount of friction is the amount that produces reliable human verification. Zero friction is not the goal — verified, trusted output is the goal.

---

## Decision 3: Explicit empty-signals state instead of low-confidence fallback

**What:** When signals are missing for Vertex Manufacturing, the AI shows an "empty signals" screen that says it cannot generate a recommendation and offers a manual follow-up CTA. It does not generate a low-confidence suggestion.

**Why:** A low-confidence AI suggestion for a deal with no signal data would be fabricated. If the rep accepts it, the CRM now contains invented information. That is worse than a missing next step.

The empty-signals state is honest: the AI had no data to work with, so it produced no output. This is better for the rep (no misleading suggestion), better for the CRM data quality (no fabricated fields), and better for the AI's long-term credibility (reps learn the AI only suggests when it has evidence).

**What this reflects:** AI products should fail loudly when they lack data, not quietly with low-confidence output. A visible "I don't have enough to suggest" response builds more trust than a hedged suggestion that turns out to be wrong.

---

## Decision 4: Save error as a first-class design case

**What:** The prototype includes a save-error state — triggered by a UI toggle — that shows "CRM connection timed out. Your AI suggestion is still saved as a draft" with Try Again / Save as Draft / Cancel options.

**Why:** Most prototypes omit error states. This one includes it because the save-error case is the moment where the rep decides whether to trust the system or give up. If the error state shows nothing useful ("Something went wrong"), the rep loses confidence in the workflow.

A save error that preserves the AI draft and offers a clear recovery path ("Save as Draft" until the connection restores) is a product decision: the user's work is not lost, and the recovery path is explicit.

**What this reflects:** Error states are product design, not edge-case afterthoughts. In any workflow where data is being written to a system of record, the error recovery experience is as important as the happy path.
