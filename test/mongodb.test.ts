import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { MongoClient } from "mongodb";
import { getMongoClient, resetMongoClientCache } from "../lib/mongodb.ts";

describe("getMongoClient", () => {
  afterEach(() => {
    resetMongoClientCache();
  });

  it("returns the same client for two lookups and does not close it", async () => {
    let connects = 0;
    let closed = 0;
    const client = {
      close: async () => {
        closed += 1;
      },
    } as unknown as MongoClient;

    const first = await getMongoClient(async () => {
      connects += 1;
      return client;
    });
    const second = await getMongoClient(async () => {
      connects += 1;
      return client;
    });

    assert.equal(first, second);
    assert.equal(connects, 1);
    assert.equal(closed, 0);
  });
});
