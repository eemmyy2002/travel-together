# Proposal

## Why

A shared group trip cannot exist until one owner can keep their own trips. Collaboration is a later phase, so this change is the single-owner slice that has to come first, with an owner stored on each trip so sharing is not blocked later.

## What Changes

- An owner can create, view, and edit their own trips. A trip has a name, destination, start date, end date, and an owner.
- The owner is a placeholder user id stored on the trip. It is set automatically and is not a field on the form. Real accounts replace it later.
- Creating a trip, or changing its start or end date, builds one empty day per date in the range, including both ends (for example, Day 1 — 14 Oct). A day is only a day number and a date.
- The end date cannot be before the start date.
- A created trip appears on the main dashboard. Edits are saved and shown.
- Archive hides a trip from the main dashboard. An Archived view can find it. Unarchive returns it to the dashboard with its data and days intact.
- Delete asks for confirmation, then permanently removes the trip and its days.

Not in this change:

- Sharing, invites, roles, and accounts.
- Cover images (upload, storage, and a default image). The trip has no image field. Left out on purpose so it is not forgotten.
- Anything on a day: activities, places, and notes (Daily Itinerary).
- Preserving a plan when dates change (Calendar & Schedule Changes 07, Daily Itinerary 02).

## Capabilities

### New Capabilities

- `trips`: An owner creates, views, edits, archives, unarchives, and deletes their own trips, and finds them on the main dashboard or an Archived view.
- `trip-days`: A trip's date range produces one empty day slot per date, including both ends, and a date edit rebuilds that list.

### Modified Capabilities

- None. There are no existing specs.

## Impact

- First application behavior in an otherwise empty project: trip dashboard, trip create and edit, an Archived view, and persistence for trips and their days.
- Later account work replaces the placeholder owner id. Later sharing can use the owner already stored on the trip.
- Known risk: days hold no plan yet, so rebuilding the day list loses nothing. Once a day holds a plan, a rebuild must not silently delete it. That protection belongs to Calendar & Schedule Changes (07) and Daily Itinerary (02), not this change.
