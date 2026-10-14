import { TripForm } from "@/components/trip-form";
import { createTripAction } from "@/lib/actions";

export default async function NewTripPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <>
      <h1>New trip</h1>
      <TripForm action={createTripAction} submitLabel="Create trip" error={error} />
    </>
  );
}
