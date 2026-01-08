import mongoose from "mongoose";

export const teardownDB = async () => {
  await mongoose.connection.db!.dropDatabase();
  await mongoose.disconnect();
};
