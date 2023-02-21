import mongoose from 'mongoose';

const DB_URI = process.env.NEXT_DB_URL;

if (!DB_URI) throw new Error('Please define the MONGODB_URI environment variable inside .env.local');

let cached: {
  promise: Promise<typeof mongoose> | null;
  conn: Awaited<typeof mongoose> | null;
};

if (!cached!) {
  cached = { conn: null, promise: null };
}

async function db() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    mongoose.set('strictQuery', true);
    cached.promise = mongoose.connect(DB_URI!, { bufferCommands: false }).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default db;
export { Favorite, type DFavorite } from './Favorite';
