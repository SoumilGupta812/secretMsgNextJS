import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}
declare global {
  var mongoose: MongooseCache;
}
let cache = global.mongoose;
if (!cache) {
  cache = global.mongoose = { conn: null, promise: null };
}
mongoose.connection.on("disconnected", () => {
  console.error("MongoDB disconnected! Attempting to reconnect...");
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
async function dbConnect() {
  if (cache.conn && mongoose.connection.readyState === 1) {
    console.log("Using cached database connection");
    return cache.conn;
  }

  if (!cache.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      heartbeatFrequencyMS: 10000,
      socketTimeoutMS: 45000,
    };
    cache.promise = mongoose
      .connect(process.env.MONGODB_URI!, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }
  try {
    cache.conn = await cache.promise;
    if (cache.conn.connection.readyState === 1) {
      console.log("Connected to database");
    } else {
      throw new Error("Failed to connect to database");
    }
  } catch (error) {
    cache.promise = null;
    throw error;
  }
  return cache.conn;
}
export default dbConnect;
// old code
// import mongoose from "mongoose";
// type ConnectionObject = { isConnected?: number };
// const connection: ConnectionObject = {};
// async function dbConnect(): Promise<void> {
//   if (connection.isConnected) {
//     console.log("Already connected to database");
//     return;
//   }
//   try {
//     const db = await mongoose.connect(process.env.MONGODB_URI || "");
//     connection.isConnected = db.connections[0].readyState;
//     console.log("Connected to database");
//   } catch (error) {
//     console.error("Error connecting to database", error);
//     process.exit(1);
//   }
// }
// export default dbConnect;
