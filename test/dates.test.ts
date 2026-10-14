import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatDayLabel, generateDays } from "../lib/dates.ts";

describe("generateDays", () => {
  it("produces Day 1 through Day 3 for 14 Oct through 16 Oct", () => {
    const result = generateDays("2026-10-14", "2026-10-16", sequence());
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.deepEqual(
      result.days.map((day) => formatDayLabel(day.dayNumber, day.date)),
      ["Day 1 — 14 Oct", "Day 2 — 15 Oct", "Day 3 — 16 Oct"],
    );
    assert.deepEqual(
      result.days.map((day) => Object.keys(day).sort()),
      [
        ["date", "dayNumber", "id"],
        ["date", "dayNumber", "id"],
        ["date", "dayNumber", "id"],
      ],
    );
  });

  it("produces only Day 1 when the range is a single day", () => {
    const result = generateDays("2026-10-14", "2026-10-14", sequence());
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.days.length, 1);
    assert.equal(formatDayLabel(result.days[0].dayNumber, result.days[0].date), "Day 1 — 14 Oct");
  });

  it("rejects an end date before the start date", () => {
    const result = generateDays("2026-10-16", "2026-10-14", sequence());
    assert.deepEqual(result, { ok: false, error: "order" });
  });
});

function sequence(): () => string {
  let next = 1;
  return () => `day-${next++}`;
}
