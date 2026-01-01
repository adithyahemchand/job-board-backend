import { JobRepository } from "../../domain/job/JobRepository";
import { Job } from "../../domain/job/Job";
import { JobId } from "../../domain/job/JobId";
import { JobModel } from "./JobSchema";

export class MongoJobRepository implements JobRepository {
  async saveJob(job: Job): Promise<void> {
    const details = job.getDetails();

    await JobModel.findByIdAndUpdate(
      details.jobId,
      {
        title: details.title,
        author: details.author,
        postedDate: details.postedDate,
        description: details.description,
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
      doc.title,
      doc.author,
      doc.postedDate,
      doc.description
    );
  }

  async deleteJob(jobId: JobId): Promise<void> {
    await JobModel.deleteOne({ _id: jobId.toString() }).exec();
  }

  async findPaginated(
    cursor: { postedDate: Date; jobId: string } | null,
    limit: number
  ): Promise<Job[]> {
    const query: any = {};

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
          doc.title,
          doc.author,
          doc.postedDate,
          doc.description
        )
    );
  }
}
