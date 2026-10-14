import { MongoClient, type Db } from "mongodb";

const globalForMongo = globalThis as typeof globalThis & {
  travelTogetherMongoClient?: Promise<MongoClient>;
};

export function resetMongoClientCache(): void {
  delete globalForMongo.travelTogetherMongoClient;
}

export async function getMongoClient(
  connect: () => Promise<MongoClient> = defaultConnect,
): Promise<MongoClient> {
  if (!globalForMongo.travelTogetherMongoClient) {
    globalForMongo.travelTogetherMongoClient = connect();
  }
  return globalForMongo.travelTogetherMongoClient;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(process.env.MONGODB_DB || "travel-together");
}

function defaultConnect(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return Promise.reject(new Error("MONGODB_URI is not set"));
  }
  const client = new MongoClient(uri);
  return client.connect();
}
