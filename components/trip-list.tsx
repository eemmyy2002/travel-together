import Link from "next/link";
import { formatCalendarDate } from "@/lib/dates";
import type { TripRecord } from "@/lib/trips";

export function TripList({
  trips,
  empty,
}: {
  trips: TripRecord[];
  empty: string;
}) {
  if (trips.length === 0) return <p className="empty">{empty}</p>;
  return (
    <ul className="trip-list">
      {trips.map((trip) => (
        <li key={trip.id}>
          <Link className="trip-card" href={`/trips/${trip.id}`}>
            <strong>{trip.name}</strong>
            <span>
              {trip.destination} · {formatCalendarDate(trip.startDate)} –{" "}
              {formatCalendarDate(trip.endDate)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
