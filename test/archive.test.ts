import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient, type Db } from "mongodb";
import {
  archiveTrip,
  createTrip,
  getTrip,
  listActiveTrips,
  listArchivedTrips,
  unarchiveTrip,
} from "../lib/trips.ts";

describe("archived view", () => {
  let server: MongoMemoryServer;
  let client: MongoClient;
  let db: Db;

  before(async () => {
    process.env.PLACEHOLDER_OWNER_ID = "owner-placeholder";
    server = await MongoMemoryServer.create();
    client = new MongoClient(server.getUri());
    await client.connect();
    db = client.db("travel-together-archive");
  });

  after(async () => {
    await client.close();
    await server.stop();
  });

  it("hides an archived trip from the dashboard and restores the same days", async () => {
    const created = await createTrip(db, {
      name: "Lisbon",
      destination: "Portugal",
      startDate: "2026-10-14",
      endDate: "2026-10-16",
    });
    assert.equal(created.ok, true);
    if (!created.ok) return;
    const days = created.trip.days;

    await archiveTrip(db, created.trip.id);
    assert.equal(
      (await listActiveTrips(db)).some((trip) => trip.id === created.trip.id),
      false,
    );
    assert.equal(
      (await listArchivedTrips(db)).some((trip) => trip.id === created.trip.id),
      true,
    );

    await unarchiveTrip(db, created.trip.id);
    const restored = await getTrip(db, created.trip.id);
    assert.deepEqual(restored?.days, days);
    assert.equal(
      (await listActiveTrips(db)).some((trip) => trip.id === created.trip.id),
      true,
    );
  });
});
