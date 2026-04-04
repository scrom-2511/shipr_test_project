import mongoose from "mongoose";

function mongoUri(): string {
  const uri = process.env.MONGODB_URI ?? process.env.DATABASE_URL;
  if (!uri) {
    throw new Error("Set MONGODB_URI or DATABASE_URL in your environment.");
  }
  return uri;
}

export async function connectDb(): Promise<void> {
  await mongoose.connect(mongoUri());
}
