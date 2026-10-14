# Spec Delta

## Purpose

Lets one owner create, view, edit, archive, unarchive, and delete their own trips, and find them on the main dashboard or an Archived view.

## ADDED Requirements

### Requirement: Create a trip
The system SHALL let the owner create a trip with a name, a destination, a start date, and an end date. Name and destination MUST be non-empty.

#### Scenario: Trip is created
- **WHEN** the owner submits a name, a destination, a start date, and an end date that is not before the start date
- **THEN** the system stores the trip and shows it on the main dashboard

#### Scenario: Required details are missing
- **WHEN** the owner submits a trip without a name, without a destination, or without either date
- **THEN** the system does not store the trip and tells the owner what is missing

### Requirement: Reject an end date before the start date
The system MUST reject a trip whose end date is before its start date. A start date equal to the end date MUST be accepted.

#### Scenario: End date is before the start date
- **WHEN** the owner submits or saves a trip whose end date is before its start date
- **THEN** the system does not store that date change and tells the owner the end date cannot be before the start date

#### Scenario: Start and end are the same day
- **WHEN** the owner submits or saves a trip whose start date and end date are the same day
- **THEN** the system accepts the dates

### Requirement: Assign a placeholder owner
The system SHALL store a placeholder user id as the trip's owner. The owner MUST be set automatically and MUST NOT be a field the user fills in. The user MUST NOT be able to change the owner in this change.

#### Scenario: Owner is stored on create
- **WHEN** the owner creates a trip
- **THEN** the trip's owner is the placeholder user id and the form did not ask for an owner

### Requirement: View a trip
The system SHALL show a trip's name, destination, start date, and end date when the owner opens it.

#### Scenario: Owner opens a trip
- **WHEN** the owner opens a trip
- **THEN** the system shows that trip's name, destination, start date, and end date

### Requirement: Back to the dashboard
The trip view SHALL offer a back control that goes to the main dashboard, including when the trip is archived. The edit view MUST NOT show that control. Cancel MUST return from the edit view to the trip view.

#### Scenario: Back from an active trip
- **WHEN** the owner opens a trip that is not archived
- **THEN** the page offers a back control to the main dashboard

#### Scenario: Back from an archived trip
- **WHEN** the owner opens an archived trip and is not editing it
- **THEN** the back control still goes to the main dashboard

#### Scenario: Edit view has no back control
- **WHEN** the owner is editing a trip
- **THEN** the page does not offer a back control to the dashboard
- **AND** the page offers Cancel, which returns to the trip view

### Requirement: Edit form stays hidden until requested
The trip page MUST NOT show the edit form when the owner first opens the trip. The page SHALL offer an edit control that reveals the form and hides the trip details. A failed save MUST leave only the form visible, with the error.

#### Scenario: Opening a trip hides the form
- **WHEN** the owner opens a trip
- **THEN** the page shows the trip details and does not show the edit form
- **AND** the page offers a control to edit the trip

#### Scenario: Edit control shows only the form
- **WHEN** the owner chooses to edit the trip
- **THEN** the page shows the edit form and does not show the trip name, destination, dates, or days

#### Scenario: Failed save keeps the form visible
- **WHEN** the owner saves an edit that the system rejects
- **THEN** the page still shows the edit form and the error, and does not show the trip details

### Requirement: Edit trip details
The system SHALL save changes to a trip's name, destination, start date, and end date, and show the saved values.

#### Scenario: Edited details are shown
- **WHEN** the owner saves a new name, destination, or valid date range for a trip
- **THEN** the system stores those values and shows them when the trip is viewed again

### Requirement: Main dashboard lists active trips
The main dashboard SHALL list the owner's trips that are not archived, including a trip immediately after it is created. Archived trips MUST NOT appear on the main dashboard.

#### Scenario: New trip appears on the dashboard
- **WHEN** the owner creates a trip
- **THEN** that trip appears on the main dashboard

#### Scenario: Archived trip is absent from the dashboard
- **WHEN** the owner views the main dashboard after archiving a trip
- **THEN** that trip is not listed there

### Requirement: Archive a trip
The system SHALL let the owner archive a trip. Archiving MUST hide the trip from the main dashboard and MUST keep the trip.

#### Scenario: Archive hides the trip
- **WHEN** the owner archives a trip
- **THEN** the trip remains stored and no longer appears on the main dashboard

### Requirement: Find archived trips
The system SHALL provide an Archived view that lists the owner's archived trips and no others.

#### Scenario: Archived trip is listed
- **WHEN** the owner opens the Archived view
- **THEN** the view lists that owner's archived trips and does not list trips that are not archived

### Requirement: Unarchive a trip
The system SHALL let the owner unarchive a trip. Unarchiving MUST return the trip to the main dashboard with its name, destination, dates, and owner unchanged.

#### Scenario: Unarchive restores the trip
- **WHEN** the owner unarchives a trip
- **THEN** the trip appears on the main dashboard again and its name, destination, dates, and owner are unchanged

### Requirement: Delete a trip after confirmation
The system SHALL permanently remove a trip only after the owner confirms in a modal on the trip page. Confirmation MUST NOT navigate to another page. Canceling MUST close the modal, leave the trip unchanged, and keep the owner on the trip page.

#### Scenario: Delete opens a modal
- **WHEN** the owner chooses to delete a trip from the trip page
- **THEN** the page shows a confirmation modal and the address stays on the trip page

#### Scenario: Confirmed delete removes the trip
- **WHEN** the owner confirms deletion of a trip
- **THEN** the system permanently removes that trip and it appears on neither the main dashboard nor the Archived view

#### Scenario: Canceled delete keeps the trip
- **WHEN** the owner starts to delete a trip and then cancels
- **THEN** the modal closes, the trip remains stored, and the owner stays on the trip page

### Requirement: Trip has no cover image
The system MUST NOT store or ask for a cover image on a trip.

#### Scenario: Create and edit omit an image
- **WHEN** the owner creates or edits a trip
- **THEN** the form has no image field and the stored trip has no image
