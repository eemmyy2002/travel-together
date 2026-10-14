---
name: change-request
description: Handle a small fix or change request during an active OpenSpec change. Updates the spec and tasks, implements it, and reports what changed. Use after /opsx-apply when something is missing or wrong.
---

# Change request

The user describes a problem or missing behavior. Ask which change it belongs to if unclear (default: the only active change in openspec/changes/).

Steps:

1. Classify the request:
   - Cosmetic (only appearance: color, spacing, font, icon style): make the change, list the files changed, and stop. Do not touch the spec or tasks.md.
   - Bug against an existing requirement (the spec already says it, the code is wrong): fix the code, list the files changed, and stop. Do not touch the spec or tasks.md.
   - Behavior change or missing behavior: continue with step 2.
   - If a wording change alters the meaning of an action, treat it as behavior.
2. Check the request. If it is ambiguous in a way that changes behavior (not styling), ask a short question, one at a time, and wait for the answer. Stop asking once the requirement is clear, and ask at most 3 questions. If it is still unclear after that, say so and suggest using /grill-me or a new /opsx-propose instead. Otherwise proceed.
3. Update the spec in openspec/changes/<name>/specs/ with a requirement and scenario, matching the existing format.
4. Add a matching task to tasks.md.
5. Update proposal.md or design.md only if this really changes the scope or a decision. Otherwise leave them alone.
6. Implement the task and mark it done.
7. List every file changed and why.

Rules:

- Make minimal edits. Do not change anything unrelated.
- Do not touch anything listed as out of scope in the proposal. If the request conflicts with it, stop and ask.
- Do not run /opsx-archive.
