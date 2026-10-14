# Design

## Context

The repository has OpenSpec planning files and no application code. See proposal.md for why this change exists. Behavior is defined in `specs/trips/spec.md` and `specs/trip-days/spec.md`.

This design adds the first Next.js (TypeScript) application and the first MongoDB data. It runs on Vercel.

## Goals / Non-Goals

**Goals:**

- Persist each trip, including its days, in one MongoDB document so a create, date edit, or delete cannot leave the trip and its days out of step.
- Validate dates and required fields on the server.
- Reuse one MongoDB client across warm Vercel isolates.

**Non-Goals:**

- An accounts system, a users collection, or an editable owner.
- A cover-image field, upload path, or object storage.
- Activity, place, or note fields on a day.
- Reconciling existing day content when dates change. Days are replaced wholesale in this change.

## Decisions

### Trip document with embedded days

Store trips in a `trips` collection. Each document holds the trip and its days:

- `name`, `destination` (non-empty strings)
- `startDate`, `endDate` (calendar dates as `YYYY-MM-DD`)
- `ownerId` (string)
- `archived` (boolean, default false)
- `days`: array of `{ id, dayNumber, date }` where `date` is `YYYY-MM-DD` and `dayNumber` starts at 1

No image field. No activity, place, or note fields on a day.

Create and date edits write the trip and the rebuilt `days` array in one update. Confirmed delete deletes the document, which removes the days. Archive and unarchive change only `archived`.

**Alternative:** a separate `days` collection. Rejected for this change. Two writes can succeed for the trip and fail for the days, and days have no content of their own yet. A day `id` inside the trip document is enough for a later itinerary to point at a day. That later change must stop replacing the whole array; see Risks.

### Calendar dates, inclusive

Treat start and end as calendar dates, not instants. Generate days by walking from `startDate` through `endDate` in UTC date arithmetic and formatting each step as `YYYY-MM-DD`, so a timezone offset cannot drop or duplicate a day. The same-day range yields Day 1 only. Reject the write when `endDate` is before `startDate`.

**Alternative:** store JavaScript `Date` timestamps and derive days in the server's local zone. Rejected because a local offset can shift the inclusive range.

### Placeholder owner

Set `ownerId` on create from a single configured placeholder (environment variable, with a fixed fallback for local development). The create and edit forms do not include an owner control, and updates do not change `ownerId`. Dashboard and Archived queries filter on this placeholder id plus `archived`.

**Alternative:** a `users` collection and a session. Rejected. Accounts are a later change; the field exists so that change can replace the placeholder.

### Archived view is a separate page

The main dashboard (`/`) lists trips with `archived: false`. `/archived` lists trips with `archived: true`. The trip page (`/trips/[id]`) shows the stored details and days, and hosts edit, archive, unarchive, and delete. Create is `/trips/new`.

**Alternative:** a filter on the dashboard. The specs allow either. A separate page keeps the main dashboard a list of active trips only, which matches the success condition that archive hides a trip from that dashboard.

### Server-side writes

Use Next.js server actions for create, update, archive, unarchive, and delete. The action checks required fields and the date order before writing. The UI also blocks an end date before the start date, but the action is the check that counts. Delete renders a confirmation step; the delete action runs only after confirm. Cancel does not call it.

### MongoDB connections on Vercel

Vercel runs the app as short-lived serverless functions. A warm isolate may handle many requests; a cold one starts empty. Opening a new `MongoClient` on every request exhausts MongoDB's connection limit.

Cache the connected client on `globalThis`. The first request in an isolate connects. Later requests in that isolate reuse the same client. Do not call `client.close()` at the end of a request. Read the database name and URI from environment variables.

Use the official MongoDB driver.

## Risks / Trade-offs

- [Replacing `days` on every date edit drops whatever was in the array] → Acceptable now because each day is only an id, a number, and a date. Once a day holds a plan (Daily Itinerary 02), a rebuild must not silently delete it. Calendar & Schedule Changes (07) should reconcile by date and keep days that already have a plan. This change does not implement that.
- [One placeholder owner means every visitor shares the same trips] → Intended until accounts exist. Do not treat the placeholder as an authorization check.
- [Embedded days make a very long trip one large document] → Acceptable for a date range a person would edit in a form. Revisit if a trip is allowed to span years.

## Migration Plan

There is no existing database or app to migrate. Deploy the Next.js app to Vercel with `MONGODB_URI` set. Rollback is redeploying the previous build. Because this is the first data, dropping the `trips` collection is a safe reset during development.

## Open Questions

None. The Archived view is a separate page, and days live on the trip document. Those choices do not change the specs.
