# Spec Delta

## Purpose

Builds one empty day slot for each date in a trip's range, including both ends, and rebuilds that list when the dates change.

## ADDED Requirements

### Requirement: Generate one day per date
When a trip is created with a valid date range, the system SHALL create one day for each date from the start date through the end date, including both ends. Each day MUST be an empty slot with a day number and a date, and MUST NOT hold activities, places, or notes.

#### Scenario: Inclusive range
- **WHEN** the owner creates a trip whose start date is 14 Oct and whose end date is 16 Oct
- **THEN** the trip has three days: Day 1 on 14 Oct, Day 2 on 15 Oct, and Day 3 on 16 Oct, and none of them has an activity, place, or note

#### Scenario: Single-day trip
- **WHEN** the owner creates a trip whose start date and end date are the same day
- **THEN** the trip has exactly one day, numbered Day 1, on that date

### Requirement: Show days on the trip
The system SHALL show each generated day as its day number and date when the owner views the trip.

#### Scenario: Days are visible
- **WHEN** the owner opens a trip that has generated days
- **THEN** the system shows each day as its day number and date

### Requirement: Rebuild days when dates change
When the owner saves a new start date or end date, the system SHALL replace the day list so there is one empty slot per date in the new range, including both ends. Day numbers MUST start again at Day 1 for the new start date.

#### Scenario: Shortening the range
- **WHEN** a trip covering 14 Oct through 16 Oct is saved with an end date of 15 Oct
- **THEN** the trip has Day 1 on 14 Oct and Day 2 on 15 Oct, and the previous 16 Oct day is gone

#### Scenario: Moving the range
- **WHEN** a trip covering 14 Oct through 15 Oct is saved with a start date of 20 Oct and an end date of 21 Oct
- **THEN** the trip has Day 1 on 20 Oct and Day 2 on 21 Oct, and the previous days are gone

### Requirement: Keep days when the trip is archived
Archiving or unarchiving a trip MUST NOT change its days.

#### Scenario: Unarchive keeps the same days
- **WHEN** the owner archives a trip and later unarchives it
- **THEN** the trip has the same day numbers and dates it had before it was archived

### Requirement: Remove days when the trip is deleted
When the owner confirms deletion of a trip, the system SHALL permanently remove that trip's days along with the trip.

#### Scenario: Confirmed delete removes days
- **WHEN** the owner confirms deletion of a trip
- **THEN** that trip's days are permanently removed

#### Scenario: Canceled delete keeps days
- **WHEN** the owner starts to delete a trip and then cancels
- **THEN** the trip's days remain unchanged
