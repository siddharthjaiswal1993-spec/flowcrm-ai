# FlowCRM AI Workspace — Improvement Prompt Chain

This file contains the three Module 2 execution prompts for improving the FlowCRM AI Workspace prototype.

Use them in this order:

1. Expansion Prompt
2. Behavior Prompt
3. Refinement Prompt

---

## 1. Expansion Prompt

```text
Add a 1st screen: AI loading state after the user clicks “Fix with AI” on the Acme Logistics deal. Show a right-side AI Assistant drawer or focused assistant panel with the message: “Reviewing CRM history, call notes, and email signals…” Include skeleton cards for CRM history, call notes, email thread, and suggested update. Match the layout of the attached enterprise dashboard reference screenshot: left navigation, clean card-based layout, soft white/light grey background, deep navy headings, blue primary actions, rounded cards, and a calm enterprise SaaS style.

Add a 2nd screen: AI recommendation review state for Acme Logistics. Show the selected deal summary, current CRM state, source signals reviewed, AI confidence, and suggested CRM update. Include these sections:
- Selected deal: Acme Logistics, $84,000, Stage: Proposal, Owner: Riya Sharma, Last activity: 18 days ago, Status: Stale
- Current CRM state: Next step empty, pricing objection not captured, follow-up task not created, required fields completed 2 of 8
- Source signals: call note, email snippet, CRM history
- AI suggested update: add next step, capture pricing concern, create follow-up task, update deal health to At risk, auto-fill 6 of 8 fields
- Buttons: Accept AI Update, Edit Before Saving, Reject Suggestion
Match the layout of the attached AI assistant/reference screenshot: right-side action panel, evidence cards, clear hierarchy, and a strong primary CTA.

Add a 3rd screen: Edit Before Saving modal. When the user clicks “Edit Before Saving,” open a centered modal over the AI Assistant screen. Show editable fields for Next step, Objection, Follow-up task, and Deal health. Pre-fill the AI recommendation. Add buttons: Save Edited Update and Cancel. Match the attached modal/reference screenshot with a clean enterprise modal layout, subtle overlay, rounded container, clear field labels, and simple button hierarchy.

Add a 4th screen: Reject Suggestion confirmation modal. When the user clicks “Reject Suggestion,” show a confirmation modal with the title “Reject AI suggestion?” Body copy: “This will keep Acme Logistics marked as stale. Missing next step and follow-up task will remain unresolved.” Add buttons: Reject Suggestion and Go Back. Match the attached confirmation modal/reference screenshot with clear warning styling, concise copy, and an obvious safe return action.

Add a 5th screen: Updated dashboard state after the user accepts the AI update. Return the user to the dashboard or workspace and show a success banner: “Acme Logistics updated. CRM data quality improved.” Reflect the updated metrics:
- Suggested updates pending: 23 → 22
- Missing next steps: 48% → 47%
- Time saved this week: 18.5h → 18.7h
- Acme Logistics status: Stale → Updated
- Acme Logistics next step: Schedule pricing review call for Friday
Match the layout of the attached dashboard reference screenshot: KPI cards across the top, insight cards in the center, and a right-side AI summary panel.

Build navigation between all 5 new states and the existing screens in this exact order:

Dashboard → Review Today’s CRM Priorities → Role-Based Workspace → Acme Logistics → Fix with AI → AI Loading State → AI Recommendation Review → Accept AI Update → Saving/Success State → Updated Dashboard.

Also support the alternate paths:
- AI Recommendation Review → Edit Before Saving → Save Edited Update → Success State → Updated Dashboard
- AI Recommendation Review → Reject Suggestion → Rejection Confirmation → Keep Acme Logistics Stale
- Vertex Manufacturing → Fix with AI → Error state: “AI could not generate a complete recommendation because no recent email or call note was found.”

Do not build a full CRM. Do not add auth, settings, real integrations, or backend logic. This is a clickable usability prototype. Keep the visual system enterprise-ready, Workday-inspired, clean, trustworthy, and focused on proving that AI-assisted CRM updates are faster and easier than long CRM forms.
```

---

## 2. Behavior Prompt

```text
Add behavior states to the FlowCRM AI Workspace prototype using strict constraint grounding.

Add a loading state with skeleton screens for the AI Assistant after the user clicks “Fix with AI” on Acme Logistics.

Loading state:
- Show the message: “Reviewing CRM history, call notes, and email signals…”
- Show skeleton cards for CRM history, call notes, email thread, and suggested update.
- Keep the user inside the same enterprise dashboard layout.
- After 1–2 seconds, show the AI recommendation review state.

Add a saving/submission state for the “Accept AI Update” action.

Saving state:
- When the user clicks “Accept AI Update,” show: “Saving update to CRM…”
- Disable the Accept, Edit, and Reject buttons while saving.
- After 1–2 seconds, show success confirmation:
  “CRM updated successfully. 6 fields auto-filled. Next step added. Follow-up task created.”

After success, update the dashboard state:
- Suggested updates pending: 23 → 22
- Missing next steps: 48% → 47%
- Time saved this week: 18.5h → 18.7h
- Acme Logistics status: Stale → Updated
- Acme Logistics next step: Schedule pricing review call for Friday

Add an empty/missing data state for Vertex Manufacturing.

Empty state:
- When the user clicks “Fix with AI” on Vertex Manufacturing, show:
  “AI could not generate a complete recommendation.”
- Supporting message:
  “No recent email or call note was found for this deal.”
- Show suggested manual action:
  “Create a manual follow-up or add a next step manually.”
- Add buttons:
  “Create Manual Follow-up”
  “Dismiss”
- Do not update any dashboard metrics for this path.

Add an error state for CRM save failure.

Error state:
- If the CRM update fails, show:
  “Update could not be saved.”
- Supporting message:
  “The CRM connection timed out. Your AI suggestion is still saved as a draft.”
- Add buttons:
  “Try Again”
  “Save as Draft”
  “Cancel”
- If the user clicks “Try Again,” return to the saving state.
- If the user clicks “Save as Draft,” show:
  “Draft saved. Acme Logistics still needs to be updated in CRM.”
- Do not change dashboard metrics unless the update is successfully saved.

Maintain the same enterprise design language throughout:
- Soft white/light grey background
- Deep navy headings
- Blue primary actions
- Rounded cards
- Subtle borders
- Clear status banners
- No flashy AI effects
- No generic placeholder text

Tether all behavior strictly to these rules. Do not add real backend logic, authentication, real integrations, or live AI calls. This is a clickable usability prototype with simulated states.
```

---

## 3. Refinement Prompt

```text
Focus only on the AI CRM Assistant / Acme Logistics update flow. Do not redesign the whole app, do not change the dashboard, and do not change the navigation logic built in the previous prompts.

Start by listing the 3 biggest gaps in design, spacing, and trust clarity compared to a polished Workday-inspired enterprise SaaS standard.

Audit specifically for:
1. Whether the AI recommendation feels evidence-based or too magical
2. Whether the spacing and card hierarchy make the flow easy to scan
3. Whether the primary action is obvious without making the screen feel pushy

Once identified, refine only the AI Assistant panel to fix those gaps.

Make the AI Assistant panel structured into these sections:

1. Selected deal summary
Show:
- Acme Logistics
- Deal value: $84,000
- Stage: Proposal
- Owner: Riya Sharma
- Last activity: 18 days ago
- Status: Stale

2. Current CRM state
Show:
- Next step: Empty
- Pricing objection: Not captured
- Follow-up task: Not created
- Required fields completed: 2 of 8

3. Source signals reviewed
Show:
- Call note: “Customer asked if pricing can be adjusted for multi-location rollout.”
- Email snippet: “Can we discuss pricing options before moving forward?”
- CRM history: “Proposal sent 18 days ago, no next step logged.”

Add microcopy:
“AI reviewed 3 available sources.”

4. AI suggested update
Show:
- Add next step: Schedule pricing review call for Friday
- Add objection: Pricing concern
- Create follow-up task: Send pricing options and book review call
- Update deal health: At risk
- Auto-fill 6 of 8 required fields

Add trust indicator:
“AI confidence: High”

Add reasoning:
“Pricing concern was found in both call notes and email. No next step exists in CRM.”

5. Impact preview
Show:
“If accepted, this update will:
- Add a next step
- Create one follow-up task
- Capture pricing objection
- Improve CRM completeness from 2/8 fields to 8/8 fields
- Reduce pending AI updates from 23 to 22”

6. Action buttons
Use clear hierarchy:
- Primary: Accept AI Update
- Secondary: Edit Before Saving
- Tertiary: Reject Suggestion

Design requirements:
- Use clean enterprise spacing
- Use rounded cards with subtle borders
- Use deep navy headings
- Use blue for the primary action
- Use calm warning styling for stale/at-risk status
- Make the AI confidence and source evidence easy to scan
- Avoid flashy AI effects, gradients, or playful visuals

Do not change anything else in the project. Only polish the AI CRM Assistant and Acme Logistics update flow.
```
