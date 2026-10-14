"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/lib/mongodb";
import {
  archiveTrip,
  createTrip,
  deleteTrip,
  unarchiveTrip,
  updateTrip,
} from "@/lib/trips";
import type { TripInput } from "@/lib/trip-model";

export async function createTripAction(formData: FormData) {
  const db = await getDb();
  const result = await createTrip(db, inputFromForm(formData));
  if (!result.ok) redirect(`/trips/new?error=${encodeURIComponent(result.error)}`);
  redirect(`/trips/${result.trip.id}`);
}

export async function updateTripAction(id: string, formData: FormData) {
  const db = await getDb();
  const result = await updateTrip(db, id, inputFromForm(formData));
  if (!result.ok) {
    redirect(`/trips/${id}?edit=1&error=${encodeURIComponent(result.error)}`);
  }
  redirect(`/trips/${id}`);
}

export async function archiveTripAction(id: string) {
  const db = await getDb();
  await archiveTrip(db, id);
  redirect("/archived");
}

export async function unarchiveTripAction(id: string) {
  const db = await getDb();
  await unarchiveTrip(db, id);
  redirect(`/trips/${id}`);
}

export async function confirmDeleteTripAction(id: string) {
  const db = await getDb();
  await deleteTrip(db, id);
  redirect("/");
}

function inputFromForm(formData: FormData): TripInput {
  return {
    name: stringValue(formData.get("name")),
    destination: stringValue(formData.get("destination")),
    startDate: stringValue(formData.get("startDate")),
    endDate: stringValue(formData.get("endDate")),
  };
}

function stringValue(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}
