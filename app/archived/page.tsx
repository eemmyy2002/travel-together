import { TripList } from "@/components/trip-list";
import { getDb } from "@/lib/mongodb";
import { listArchivedTrips } from "@/lib/trips";

export const dynamic = "force-dynamic";

export default async function ArchivedPage() {
  const trips = await listArchivedTrips(await getDb());
  return (
    <>
      <h1>Archived</h1>
      <TripList trips={trips} empty="No archived trips." />
    </>
  );
}
