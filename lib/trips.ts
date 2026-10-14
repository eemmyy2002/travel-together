import { ObjectId, type Db } from "mongodb";
import {
  buildNewTrip,
  buildTripUpdate,
  getPlaceholderOwnerId,
  type TripDay,
  type TripDraft,
  type TripInput,
} from "./trip-model";

export type TripRecord = TripDraft & { id: string };

type TripDocument = {
  _id: ObjectId;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  ownerId: string;
  archived: boolean;
  days: TripDay[];
};

export type TripCommandResult =
  | { ok: true; trip: TripRecord }
  | { ok: false; error: string };

const collectionName = "trips";

export async function createTrip(
  db: Db,
  input: TripInput,
): Promise<TripCommandResult> {
  const built = buildNewTrip(input, getPlaceholderOwnerId());
  if (!built.ok) return built;
  const document = toDocument(built.trip);
  await db.collection<TripDocument>(collectionName).insertOne(document);
  return { ok: true, trip: toRecord(document) };
}

export async function updateTrip(
  db: Db,
  id: string,
  input: TripInput,
): Promise<TripCommandResult> {
  const existing = await findDocument(db, id);
  if (!existing) return { ok: false, error: "Trip not found." };
  const built = buildTripUpdate(toRecord(existing), input);
  if (!built.ok) return built;
  await db.collection<TripDocument>(collectionName).updateOne(
    { _id: existing._id },
    {
      $set: {
        name: built.trip.name,
        destination: built.trip.destination,
        startDate: built.trip.startDate,
        endDate: built.trip.endDate,
        days: built.trip.days,
      },
    },
  );
  return { ok: true, trip: { ...built.trip, id } };
}

export async function archiveTrip(
  db: Db,
  id: string,
): Promise<TripCommandResult> {
  return setArchived(db, id, true);
}

export async function unarchiveTrip(
  db: Db,
  id: string,
): Promise<TripCommandResult> {
  return setArchived(db, id, false);
}

export async function deleteTrip(db: Db, id: string): Promise<{ ok: boolean }> {
  if (!ObjectId.isValid(id)) return { ok: false };
  const result = await db
    .collection(collectionName)
    .deleteOne({ _id: new ObjectId(id), ownerId: getPlaceholderOwnerId() });
  return { ok: result.deletedCount === 1 };
}

export async function getTrip(db: Db, id: string): Promise<TripRecord | null> {
  const document = await findDocument(db, id);
  return document ? toRecord(document) : null;
}

export async function listActiveTrips(db: Db): Promise<TripRecord[]> {
  return listTrips(db, false);
}

export async function listArchivedTrips(db: Db): Promise<TripRecord[]> {
  return listTrips(db, true);
}

async function setArchived(
  db: Db,
  id: string,
  archived: boolean,
): Promise<TripCommandResult> {
  const existing = await findDocument(db, id);
  if (!existing) return { ok: false, error: "Trip not found." };
  await db.collection<TripDocument>(collectionName).updateOne(
    { _id: existing._id },
    { $set: { archived } },
  );
  return { ok: true, trip: toRecord({ ...existing, archived }) };
}

async function listTrips(db: Db, archived: boolean): Promise<TripRecord[]> {
  const documents = await db
    .collection<TripDocument>(collectionName)
    .find({ ownerId: getPlaceholderOwnerId(), archived })
    .sort({ _id: -1 })
    .toArray();
  return documents.map(toRecord);
}

async function findDocument(db: Db, id: string): Promise<TripDocument | null> {
  if (!ObjectId.isValid(id)) return null;
  return db.collection<TripDocument>(collectionName).findOne({
    _id: new ObjectId(id),
    ownerId: getPlaceholderOwnerId(),
  });
}

function toDocument(trip: TripDraft): TripDocument {
  return {
    _id: new ObjectId(),
    name: trip.name,
    destination: trip.destination,
    startDate: trip.startDate,
    endDate: trip.endDate,
    ownerId: trip.ownerId,
    archived: trip.archived,
    days: trip.days,
  };
}

function toRecord(document: TripDocument): TripRecord {
  return {
    id: document._id.toHexString(),
    name: document.name,
    destination: document.destination,
    startDate: document.startDate,
    endDate: document.endDate,
    ownerId: document.ownerId,
    archived: document.archived,
    days: document.days,
  };
}
