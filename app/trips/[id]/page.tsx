import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteTripButton } from "@/components/delete-confirmation";
import { TripForm } from "@/components/trip-form";
import { formatDayLabel } from "@/lib/dates";
import {
  archiveTripAction,
  confirmDeleteTripAction,
  unarchiveTripAction,
  updateTripAction,
} from "@/lib/actions";
import { getDb } from "@/lib/mongodb";
import { getTrip } from "@/lib/trips";

export const dynamic = "force-dynamic";

export default async function TripPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; edit?: string }>;
}) {
  const { id } = await params;
  const { error, edit } = await searchParams;
  const showEditForm = edit === "1" || Boolean(error);
  const trip = await getTrip(await getDb(), id);
  if (!trip) notFound();

  const save = updateTripAction.bind(null, id);
  const archive = archiveTripAction.bind(null, id);
  const unarchive = unarchiveTripAction.bind(null, id);
  const confirmDelete = confirmDeleteTripAction.bind(null, id);

  return (
    <>
      {showEditForm ? (
        <>
          <h2>Edit trip</h2>
          <TripForm
            action={save}
            submitLabel="Save changes"
            error={error}
            values={{
              name: trip.name,
              destination: trip.destination,
              startDate: trip.startDate,
              endDate: trip.endDate,
            }}
          />
          <p>
            <Link href={`/trips/${trip.id}`}>Cancel</Link>
          </p>
        </>
      ) : (
        <>
          <Link className="button secondary back-link" href="/">
            Back
          </Link>
          <h1>{trip.name}</h1>
          <p>
            {trip.destination}
            <br />
            {trip.startDate} to {trip.endDate}
          </p>
          <h2>Days</h2>
          <ol className="day-list">
            {trip.days.map((day) => (
              <li key={day.id}>{formatDayLabel(day.dayNumber, day.date)}</li>
            ))}
          </ol>
          <p>
            <Link className="button" href={`/trips/${trip.id}?edit=1`}>
              Edit
            </Link>
          </p>
          <div className="actions" style={{ marginTop: "1.5rem" }}>
            {trip.archived ? (
              <form action={unarchive}>
                <button className="secondary" type="submit">
                  Unarchive
                </button>
              </form>
            ) : (
              <form action={archive}>
                <button className="secondary" type="submit">
                  Archive
                </button>
              </form>
            )}
            <DeleteTripButton tripName={trip.name} confirmAction={confirmDelete} />
          </div>
        </>
      )}
    </>
  );
}
