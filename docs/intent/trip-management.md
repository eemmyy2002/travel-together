# Trip management: statement of intent

Confirmed statement of intent. Merged from two interview runs (grill-me as the base, with additions from interview-me).

- **Outcome:** One owner can create, view, edit, archive, unarchive, and delete their own trips. A trip has a name, destination, start date, end date, and an owner. Creating it, or changing its dates, builds one empty day per date in the range, including both ends (Day 1 — 14 Oct). The end date cannot be before the start date.
- **User:** The trip owner, alone. The real product is a shared group trip. This change is the single-owner slice.
- **Why now:** Collaboration is Phase 2. This has to exist first, with an owner on the trip so sharing is not blocked later.
- **Success:**
  - The trip shows on the main dashboard after it is created.
  - Edits are saved and shown.
  - Changing the start or end date rebuilds the empty day list so it matches the new range.
  - Archive hides the trip from the main dashboard.
  - An Archived view (a separate list or a filter) can find it, and unarchive puts it back with its data and days intact.
  - Delete asks for confirmation, then permanently removes the trip and its days.
- **Constraint:** No accounts in this change. The owner is a placeholder user id stored on the trip, to be replaced by real accounts later. The owner is set automatically and is not a field the user fills in on the form. Days hold no plan, so regenerating them loses nothing.
- **Out of scope:**
  - Sharing, invites, roles, and accounts.
  - Cover images (upload, storage, default image). There is no image field on the trip yet. This was left out on purpose; record it in the proposal so it is not forgotten.
  - Anything on a day: Daily Itinerary (activities, places, notes).
  - Preserving a plan when dates change (Calendar & Schedule Changes 07, Daily Itinerary 02). The proposal should record the risk: once a day holds a plan, a rebuild must not silently delete it.