# Specification

## Summary
**Goal:** Build a self-healing IT support app that lets authenticated users create guided troubleshooting sessions, follow recommended runbooks with recorded outcomes, and review or escalate past sessions.

**Planned changes:**
- Add Internet Identity sign-in gating; use the authenticated principal as the identity for all saved sessions and history.
- Implement an “Issue Intake” flow to capture category, short title, symptoms, and optional notes, then create a new troubleshooting session and navigate to its detail view.
- Add backend session persistence and access control with methods: createSession, getSession, listMySessions, recordStepResult, setSessionStatus.
- Provide a built-in runbook catalog (minimum 6 categories, 3 runbooks each) and show a recommended runbook in the session detail view with step-by-step progression.
- Support “Quick Action” (simulated) steps that copy commands/snippets or reveal device instructions and record that the user attempted them.
- Add session outcomes: mark Resolved (locks step editing and records timestamp) or Escalated (generates a copyable incident summary of symptoms and steps/outcomes).
- Create a History view to list/search/filter the current user’s sessions by status/category and open a read-only troubleshooting timeline.
- Apply a consistent IT-support visual theme and ensure all user-facing text is in English.
- Generate and use static image assets from frontend/public/assets/generated (logo, landing hero, category icons).

**User-visible outcome:** Users can sign in, start an IT issue intake to create a troubleshooting session, follow guided runbook steps (with simulated quick actions), mark outcomes (resolved/escalated with copyable summary), and search/filter their personal troubleshooting history.
