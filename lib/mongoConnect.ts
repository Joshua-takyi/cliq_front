import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const MONGODB_URI = process.env.MONGODB_URI;
let cachedConnection: typeof mongoose | null = null;

const ConnectDb = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    if (process.env.NODE_ENV === "development") {
      let globalWithMongoose = global as typeof globalThis & {
        _mongooseConnection?: typeof mongoose;
      };

      if (!globalWithMongoose._mongooseConnection) {
        globalWithMongoose._mongooseConnection = await mongoose.connect(MONGODB_URI);
      }
      cachedConnection = globalWithMongoose._mongooseConnection;
    } else {
      cachedConnection = await mongoose.connect(MONGODB_URI, {
        serverApi: {
          version: "1",
          strict: true,
          deprecationErrors: true,
        },
      });
    }

    console.log("Connected to MongoDB successfully");
    return cachedConnection;
  } catch (error) {
    throw new Error(`Failed to connect to MongoDB: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export default ConnectDb;
