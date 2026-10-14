# Tasks

## 1. Application shell

- [x] 1.1 Scaffold a Next.js App Router app in TypeScript and verify `npm run build` succeeds
- [x] 1.2 Add the official `mongodb` driver, `node:test` as the test script, and `.env.example` listing `MONGODB_URI`, the database name, and the placeholder owner id, and verify `npm test` runs with no failures

## 2. Trip and day rules

- [x] 2.1 Implement inclusive calendar-date day generation and the end-before-start check using `YYYY-MM-DD` UTC date arithmetic, and verify `node:test` covers 14 Oct–16 Oct producing Day 1–Day 3, a same-day range producing only Day 1, and an end date before the start date being rejected
- [x] 2.2 Implement the trip write model so create sets `ownerId` from the placeholder, edits do not change `ownerId`, and the document has no image field and days have no activity, place, or note fields, and verify `node:test` covers those rules

## 3. Persistence

- [x] 3.1 Add a MongoDB client cached on `globalThis` that does not close after a request, and verify a test that two lookups in one process return the same client
- [x] 3.2 Implement trip create, update, archive, unarchive, delete, and the active and archived lists against the `trips` collection, writing days in the same document as the trip, and verify tests with an in-memory MongoDB show a date edit replaces the day list and keeps `ownerId`, archive changes only `archived`, and delete removes the document and its days

## 4. Trip pages

- [x] 4.1 Add the main dashboard at `/` and create at `/trips/new` with server actions that reject missing name, destination, or dates, and verify a test that a valid trip appears on the active list and the create form has no owner field and no image field
- [x] 4.2 Add `/trips/[id]` to show name, destination, dates, and each day number and date, and to save edits, and verify a test that saved details are shown and a date change rebuilds the days
- [x] 4.3 Add `/archived` plus archive and unarchive actions, and verify a test that an archived trip is absent from `/` data, present on `/archived`, and returns to `/` with the same days after unarchive
- [x] 4.4 Add delete confirmation on the trip page so cancel does not delete and confirm permanently removes the trip, and verify a test for both paths

## 5. End-to-end check

- [x] 5.1 Verify one integration test of the success path: create a trip from 14 Oct through 16 Oct, see three days, change the end date to 15 Oct and see two days, archive it, find it only on the Archived view, unarchive it with those days intact, then confirm delete and see it gone from both lists

## 6. Back to the dashboard

- [x] 6.1 Add a back control on the trip page that always links to the main dashboard, including when the trip is archived, and verify the control is present and points at `/`

## 7. Edit on request

- [x] 7.1 Hide the edit form on the trip page until the owner clicks Edit, keep the form visible when a save is rejected, and verify both states on the trip page

## 8. Edit without the trip detail

- [x] 8.1 While the edit form is open, hide the trip name, destination, dates, and days, and verify the edit page shows the form without those details

## 9. No back control while editing

- [x] 9.1 Remove the back control from the edit view, keep it on the trip view, and verify the edit view offers Cancel instead of Back

## 10. Delete confirmation modal

- [x] 10.1 Confirm delete in a modal on the trip page instead of a separate page, and verify cancel closes the modal without leaving the trip or deleting it
