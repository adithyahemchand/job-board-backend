import { JobRepository } from "../../domain/job/JobRepository";
import { Job } from "../../domain/job/Job";
import { JobId } from "../../domain/job/valueObjects/JobId";
import { JobModel } from "./JobSchema";
import { JobTitle } from "../../domain/job/valueObjects/JobTitle";
import { JobAuthor } from "../../domain/job/valueObjects/JobAuthor";
import { JobDescription } from "../../domain/job/valueObjects/JobDescription";

type JobCursorQuery = {
  $or?: (
    | { postedDate: { $lt: Date } }
    | { postedDate: Date; _id: { $lt: string } }
  )[];
};

export class MongoJobRepository implements JobRepository {
  async saveJob(job: Job): Promise<void> {
    await JobModel.findByIdAndUpdate(
      job.getId().toString(),
      {
        title: job.getTitle().getValue(),
        author: job.getAuthor().getValue(),
        postedDate: job.getPostedDate(),
        description: job.getDescription().getValue(),
      },
      // Using upsert to allow the same method to handle both create and update.
      { upsert: true, new: true }
    );
  }

  async findJobById(jobId: JobId): Promise<Job | null> {
    const doc = await JobModel.findById(jobId.toString()).exec();
    if (!doc) return null;

    return new Job(
      new JobId(doc._id.toString()),
      JobTitle.create(doc.title),
      JobAuthor.create(doc.author),
      doc.postedDate,
      JobDescription.create(doc.description)
    );
  }

  async deleteJob(jobId: JobId): Promise<void> {
    await JobModel.deleteOne({ _id: jobId.toString() }).exec();
  }

  async findPaginated(
    cursor: { postedDate: Date; jobId: string } | null,
    limit: number
  ): Promise<Job[]> {
    const query: JobCursorQuery = {};

    if (cursor) {
      // fetch records strictly older than the last item from previous page
      query.$or = [
        { postedDate: { $lt: cursor.postedDate } },
        {
          postedDate: cursor.postedDate,
          _id: { $lt: cursor.jobId },
        },
      ];
    }

    const docs = await JobModel.find(query)
      .sort({ postedDate: -1, _id: -1 })
      .limit(limit)
      .exec();

    return docs.map(
      (doc) =>
        new Job(
          new JobId(doc._id.toString()),
          JobTitle.create(doc.title),
          JobAuthor.create(doc.author),
          doc.postedDate,
          JobDescription.create(doc.description)
        )
    );
  }
}
