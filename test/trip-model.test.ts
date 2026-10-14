import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildNewTrip, buildTripUpdate, dayHasNoPlan, tripHasNoImage } from "../lib/trip-model.ts";

describe("trip write model", () => {
  it("sets the placeholder owner and stores no image or day plan", () => {
    const created = buildNewTrip(
      {
        name: "Lisbon",
        destination: "Portugal",
        startDate: "2026-10-14",
        endDate: "2026-10-14",
        ownerId: "someone-else",
        image: "photo.jpg",
        coverImage: "cover.jpg",
      },
      "owner-placeholder",
    );
    assert.equal(created.ok, true);
    if (!created.ok) return;
    assert.equal(created.trip.ownerId, "owner-placeholder");
    assert.equal(tripHasNoImage(created.trip), true);
    assert.equal(created.trip.days.every(dayHasNoPlan), true);
  });

  it("does not change the owner when the trip is edited", () => {
    const created = buildNewTrip(
      {
        name: "Lisbon",
        destination: "Portugal",
        startDate: "2026-10-14",
        endDate: "2026-10-15",
      },
      "owner-placeholder",
    );
    assert.equal(created.ok, true);
    if (!created.ok) return;
    const updated = buildTripUpdate(created.trip, {
      name: "Porto",
      destination: "Portugal",
      startDate: "2026-10-20",
      endDate: "2026-10-21",
      ownerId: "other-user",
      image: "nope.jpg",
    });
    assert.equal(updated.ok, true);
    if (!updated.ok) return;
    assert.equal(updated.trip.ownerId, "owner-placeholder");
    assert.equal(tripHasNoImage(updated.trip), true);
    assert.deepEqual(
      updated.trip.days.map((day) => day.date),
      ["2026-10-20", "2026-10-21"],
    );
  });
});
