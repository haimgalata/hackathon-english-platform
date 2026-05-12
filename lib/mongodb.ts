import { MongoClient, Db } from 'mongodb';

const globalForMongo = globalThis as unknown as {
  mongoClientPromise?: Promise<MongoClient>;
  mongoInitPromise?: Promise<void>;
};

function requireUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri?.trim()) {
    throw new Error('Missing environment variable: MONGODB_URI');
  }
  return uri.trim();
}

function getDbName(): string {
  return process.env.MONGODB_DB_NAME?.trim() || 'speaktech';
}

async function connectClient(): Promise<MongoClient> {
  const uri = requireUri();
  const client = new MongoClient(uri);
  return client.connect();
}

function getClientPromise(): Promise<MongoClient> {
  if (globalForMongo.mongoClientPromise) {
    return globalForMongo.mongoClientPromise;
  }
  const promise = connectClient().catch((err) => {
    globalForMongo.mongoClientPromise = undefined;
    throw err;
  });
  globalForMongo.mongoClientPromise = promise;
  return promise;
}

/** Ensures named collections exist (Mongo creates on first insert; this pre-creates empty ones). */
export async function ensureSpeaktechCollections(db: Db): Promise<void> {
  const existing = new Set((await db.listCollections().toArray()).map((c) => c.name));
  const required = ['users', 'students', 'chat_sessions', 'messages', 'progress'];
  for (const name of required) {
    if (!existing.has(name)) {
      await db.createCollection(name);
    }
  }
}

let indexesEnsured = false;

export async function ensureSpeaktechIndexes(db: Db): Promise<void> {
  if (indexesEnsured) return;
  indexesEnsured = true;
  await db.collection('students').createIndex({ username: 1 }, { unique: true });
  await db.collection('chat_sessions').createIndex({ student_id: 1 });
  await db.collection('messages').createIndex({ session_id: 1 });
}

async function initDbOnce(db: Db): Promise<void> {
  if (globalForMongo.mongoInitPromise) {
    return globalForMongo.mongoInitPromise;
  }
  const p = (async () => {
    await ensureSpeaktechCollections(db);
    await ensureSpeaktechIndexes(db);
  })().catch((err) => {
    globalForMongo.mongoInitPromise = undefined;
    throw err;
  });
  globalForMongo.mongoInitPromise = p;
  return p;
}

/**
 * Returns the SpeakTech database. Uses a single cached MongoClient in development
 * to survive Next.js hot reloads.
 */
export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  const db = client.db(getDbName());
  await initDbOnce(db);
  return db;
}
