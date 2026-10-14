import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient, type Db } from "mongodb";
import {
  archiveTrip,
  createTrip,
  deleteTrip,
  getTrip,
  listActiveTrips,
  listArchivedTrips,
  unarchiveTrip,
  updateTrip,
} from "../lib/trips.ts";

describe("trip success path", () => {
  let server: MongoMemoryServer;
  let client: MongoClient;
  let db: Db;

  before(async () => {
    process.env.PLACEHOLDER_OWNER_ID = "owner-placeholder";
    server = await MongoMemoryServer.create();
    client = new MongoClient(server.getUri());
    await client.connect();
    db = client.db("travel-together-integration");
  });

  after(async () => {
    await client.close();
    await server.stop();
  });

  it("creates, edits dates, archives, unarchives, and deletes a trip", async () => {
    const created = await createTrip(db, {
      name: "Lisbon",
      destination: "Portugal",
      startDate: "2026-10-14",
      endDate: "2026-10-16",
    });
    assert.equal(created.ok, true);
    if (!created.ok) return;
    assert.deepEqual(
      created.trip.days.map((day) => ({ dayNumber: day.dayNumber, date: day.date })),
      [
        { dayNumber: 1, date: "2026-10-14" },
        { dayNumber: 2, date: "2026-10-15" },
        { dayNumber: 3, date: "2026-10-16" },
      ],
    );
    assert.equal(
      (await listActiveTrips(db)).some((trip) => trip.id === created.trip.id),
      true,
    );

    const edited = await updateTrip(db, created.trip.id, {
      name: "Lisbon",
      destination: "Portugal",
      startDate: "2026-10-14",
      endDate: "2026-10-15",
    });
    assert.equal(edited.ok, true);
    if (!edited.ok) return;
    assert.deepEqual(
      edited.trip.days.map((day) => ({ dayNumber: day.dayNumber, date: day.date })),
      [
        { dayNumber: 1, date: "2026-10-14" },
        { dayNumber: 2, date: "2026-10-15" },
      ],
    );

    await archiveTrip(db, created.trip.id);
    assert.equal(
      (await listActiveTrips(db)).some((trip) => trip.id === created.trip.id),
      false,
    );
    assert.equal(
      (await listArchivedTrips(db)).some((trip) => trip.id === created.trip.id),
      true,
    );

    const daysBeforeUnarchive = (await getTrip(db, created.trip.id))?.days;
    await unarchiveTrip(db, created.trip.id);
    const restored = await getTrip(db, created.trip.id);
    assert.equal(restored?.archived, false);
    assert.deepEqual(restored?.days, daysBeforeUnarchive);
    assert.equal(
      (await listActiveTrips(db)).some((trip) => trip.id === created.trip.id),
      true,
    );
    assert.equal(
      (await listArchivedTrips(db)).some((trip) => trip.id === created.trip.id),
      false,
    );

    await deleteTrip(db, created.trip.id);
    assert.equal(await getTrip(db, created.trip.id), null);
    assert.equal(
      (await listActiveTrips(db)).some((trip) => trip.id === created.trip.id),
      false,
    );
    assert.equal(
      (await listArchivedTrips(db)).some((trip) => trip.id === created.trip.id),
      false,
    );
  });
});
