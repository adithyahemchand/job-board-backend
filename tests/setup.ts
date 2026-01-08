import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const setupDB = async () => {
  if (!process.env.MONGO_TEST_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  await mongoose.connect(process.env.MONGO_TEST_URI);
  await mongoose.connection.db!.dropDatabase(); // clean slate
};
