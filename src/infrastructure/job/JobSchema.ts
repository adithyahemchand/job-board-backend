import mongoose, { Schema, Document } from "mongoose";

export interface JobDocument extends Document {
  title: string;
  author: string;
  postedDate: Date;
  description: string;
}

const JobSchema = new Schema<JobDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    postedDate: {
      type: Date,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false,
    _id: false,
  }
);

JobSchema.add({ _id: String });

export const JobModel = mongoose.model<JobDocument>("Job", JobSchema);
