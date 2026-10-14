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

describe("trip repository", () => {
  let server: MongoMemoryServer;
  let client: MongoClient;
  let db: Db;

  before(async () => {
    process.env.PLACEHOLDER_OWNER_ID = "owner-placeholder";
    server = await MongoMemoryServer.create();
    client = new MongoClient(server.getUri());
    await client.connect();
    db = client.db("travel-together-test");
  });

  after(async () => {
    await client.close();
    await server.stop();
  });

  it("replaces days on a date edit, keeps the owner, archives without other changes, and deletes the document", async () => {
    const created = await createTrip(db, {
      name: "Lisbon",
      destination: "Portugal",
      startDate: "2026-10-14",
      endDate: "2026-10-16",
      ownerId: "other-user",
    });
    assert.equal(created.ok, true);
    if (!created.ok) return;
    assert.equal(created.trip.ownerId, "owner-placeholder");
    assert.deepEqual(
      created.trip.days.map((day) => day.date),
      ["2026-10-14", "2026-10-15", "2026-10-16"],
    );

    const updated = await updateTrip(db, created.trip.id, {
      name: "Lisbon",
      destination: "Portugal",
      startDate: "2026-10-14",
      endDate: "2026-10-15",
      ownerId: "other-user",
    });
    assert.equal(updated.ok, true);
    if (!updated.ok) return;
    assert.equal(updated.trip.ownerId, "owner-placeholder");
    assert.deepEqual(
      updated.trip.days.map((day) => day.date),
      ["2026-10-14", "2026-10-15"],
    );

    const beforeArchive = await getTrip(db, created.trip.id);
    const archived = await archiveTrip(db, created.trip.id);
    assert.equal(archived.ok, true);
    if (!archived.ok || !beforeArchive) return;
    assert.equal(archived.trip.archived, true);
    assert.equal(archived.trip.name, beforeArchive.name);
    assert.equal(archived.trip.destination, beforeArchive.destination);
    assert.equal(archived.trip.ownerId, beforeArchive.ownerId);
    assert.deepEqual(archived.trip.days, beforeArchive.days);
    assert.equal((await listActiveTrips(db)).some((trip) => trip.id === created.trip.id), false);
    assert.equal((await listArchivedTrips(db)).some((trip) => trip.id === created.trip.id), true);

    const removed = await deleteTrip(db, created.trip.id);
    assert.equal(removed.ok, true);
    assert.equal(await getTrip(db, created.trip.id), null);
  });
});
