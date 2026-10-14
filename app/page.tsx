import Link from "next/link";
import { TripList } from "@/components/trip-list";
import { getDb } from "@/lib/mongodb";
import { listActiveTrips } from "@/lib/trips";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const trips = await listActiveTrips(await getDb());
  return (
    <>
      <div className="page-heading">
        <h1>Trips</h1>
        <Link className="button" href="/trips/new">
          New trip
        </Link>
      </div>
      <TripList trips={trips} empty="No trips yet." />
    </>
  );
}
