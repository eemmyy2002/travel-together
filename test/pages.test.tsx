import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient, type Db } from "mongodb";
import { DeleteDialog, DeleteTripButton } from "../components/delete-confirmation.tsx";
import { TripForm, tripFormFieldNames } from "../components/trip-form.tsx";
import { createTrip, deleteTrip, getTrip, listActiveTrips, updateTrip } from "../lib/trips.ts";

describe("create form and active list", () => {
  let server: MongoMemoryServer;
  let client: MongoClient;
  let db: Db;

  before(async () => {
    process.env.PLACEHOLDER_OWNER_ID = "owner-placeholder";
    server = await MongoMemoryServer.create();
    client = new MongoClient(server.getUri());
    await client.connect();
    db = client.db("travel-together-pages");
  });

  after(async () => {
    await client.close();
    await server.stop();
  });

  it("does not store a trip when name, destination, or dates are missing", async () => {
    const before = await listActiveTrips(db);
    const result = await createTrip(db, { name: " ", destination: "", startDate: "", endDate: "" });
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.match(result.error, /name/);
    assert.match(result.error, /destination/);
    assert.match(result.error, /start date/);
    assert.match(result.error, /end date/);
    assert.equal((await listActiveTrips(db)).length, before.length);
  });

  it("shows a created trip on the active list and the form has no owner or image field", async () => {
    const created = await createTrip(db, {
      name: "Kyoto",
      destination: "Japan",
      startDate: "2026-04-02",
      endDate: "2026-04-02",
    });
    assert.equal(created.ok, true);
    if (!created.ok) return;
    const active = await listActiveTrips(db);
    assert.equal(active.some((trip) => trip.id === created.trip.id), true);

    const html = renderToStaticMarkup(
      createElement(TripForm, {
        action: () => undefined,
        submitLabel: "Create trip",
      }),
    );
    for (const name of tripFormFieldNames) {
      assert.match(html, new RegExp(`name="${name}"`));
    }
    assert.equal(html.includes('name="owner'), false);
    assert.equal(html.includes('name="ownerId"'), false);
    assert.equal(html.includes('type="file"'), false);
    assert.equal(html.includes("image"), false);
    assert.equal(html.includes("cover"), false);
  });

  it("shows saved details and rebuilds days when the dates change", async () => {
    const created = await createTrip(db, {
      name: "Kyoto",
      destination: "Japan",
      startDate: "2026-10-14",
      endDate: "2026-10-16",
    });
    assert.equal(created.ok, true);
    if (!created.ok) return;
    const updated = await updateTrip(db, created.trip.id, {
      name: "Osaka",
      destination: "Japan",
      startDate: "2026-10-14",
      endDate: "2026-10-15",
    });
    assert.equal(updated.ok, true);
    const shown = await getTrip(db, created.trip.id);
    assert.equal(shown?.name, "Osaka");
    assert.equal(shown?.destination, "Japan");
    assert.deepEqual(
      shown?.days.map((day) => day.date),
      ["2026-10-14", "2026-10-15"],
    );
  });

  it("keeps a trip when deletion is not confirmed and removes it when it is", async () => {
    const created = await createTrip(db, {
      name: "Kyoto",
      destination: "Japan",
      startDate: "2026-10-14",
      endDate: "2026-10-14",
    });
    assert.equal(created.ok, true);
    if (!created.ok) return;

    const closed = renderToStaticMarkup(
      createElement(DeleteTripButton, {
        tripName: created.trip.name,
        confirmAction: () => undefined,
      }),
    );
    assert.equal(closed.includes('role="dialog"'), false);
    assert.equal(closed.includes("/delete"), false);

    const html = renderToStaticMarkup(
      createElement(DeleteDialog, {
        tripName: created.trip.name,
        confirmAction: () => undefined,
        onCancel: () => undefined,
      }),
    );
    assert.match(html, /role="dialog"/);
    assert.match(html, />Cancel</);
    assert.equal(html.includes('href='), false);
    assert.equal(await getTrip(db, created.trip.id) !== null, true);

    assert.equal((await deleteTrip(db, created.trip.id)).ok, true);
    assert.equal(await getTrip(db, created.trip.id), null);
  });
});
