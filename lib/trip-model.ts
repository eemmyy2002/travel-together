import { generateDays, parseCalendarDate, type GeneratedDay } from "./dates";

export type TripDay = GeneratedDay;

export type TripInput = {
  name?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  ownerId?: string;
  image?: string;
  coverImage?: string;
};

export type TripDraft = {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  ownerId: string;
  archived: boolean;
  days: TripDay[];
};

export type TripWriteResult =
  | { ok: true; trip: TripDraft }
  | { ok: false; error: string };

const DAY_KEYS = ["id", "dayNumber", "date"] as const;

export function getPlaceholderOwnerId(): string {
  return process.env.PLACEHOLDER_OWNER_ID || "owner-placeholder";
}

export function tripHasNoImage(trip: object): boolean {
  return !("image" in trip) && !("coverImage" in trip);
}

export function dayHasNoPlan(day: object): boolean {
  return Object.keys(day).every((key) =>
    (DAY_KEYS as readonly string[]).includes(key),
  );
}

export function buildNewTrip(
  input: TripInput,
  ownerId = getPlaceholderOwnerId(),
): TripWriteResult {
  const fields = readFields(input);
  if (!fields.ok) return fields;
  const days = generateDays(fields.startDate, fields.endDate);
  if (!days.ok) return { ok: false, error: dateError(days.error) };
  return {
    ok: true,
    trip: {
      name: fields.name,
      destination: fields.destination,
      startDate: fields.startDate,
      endDate: fields.endDate,
      ownerId,
      archived: false,
      days: days.days,
    },
  };
}

export function buildTripUpdate(
  existing: TripDraft,
  input: TripInput,
): TripWriteResult {
  const fields = readFields(input);
  if (!fields.ok) return fields;
  const datesChanged =
    fields.startDate !== existing.startDate || fields.endDate !== existing.endDate;
  const days = datesChanged
    ? generateDays(fields.startDate, fields.endDate)
    : { ok: true as const, days: existing.days };
  if (!days.ok) return { ok: false, error: dateError(days.error) };
  return {
    ok: true,
    trip: {
      name: fields.name,
      destination: fields.destination,
      startDate: fields.startDate,
      endDate: fields.endDate,
      ownerId: existing.ownerId,
      archived: existing.archived,
      days: days.days,
    },
  };
}

function readFields(
  input: TripInput,
):
  | {
      ok: true;
      name: string;
      destination: string;
      startDate: string;
      endDate: string;
    }
  | { ok: false; error: string } {
  const name = input.name?.trim() ?? "";
  const destination = input.destination?.trim() ?? "";
  const startDate = input.startDate?.trim() ?? "";
  const endDate = input.endDate?.trim() ?? "";
  const missing: string[] = [];
  if (!name) missing.push("name");
  if (!destination) missing.push("destination");
  if (!startDate) missing.push("start date");
  if (!endDate) missing.push("end date");
  if (missing.length > 0) {
    return { ok: false, error: `Missing ${missing.join(", ")}.` };
  }
  if (!parseCalendarDate(startDate) || !parseCalendarDate(endDate)) {
    return { ok: false, error: "Enter a valid start date and end date." };
  }
  return { ok: true, name, destination, startDate, endDate };
}

function dateError(error: "invalid" | "order"): string {
  if (error === "order") return "The end date cannot be before the start date.";
  return "Enter a valid start date and end date.";
}
