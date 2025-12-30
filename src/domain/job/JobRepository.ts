import { Job } from "./Job";
import { JobId } from "./JobId";

export interface JobRepository {
  saveJob(job: Job): Promise<void>;
  findJobById(jobId: JobId): Promise<Job | null>;
  deleteJob(jobId: JobId): Promise<void>;
  findPaginated(cursor: Date | null, limit: number): Promise<Job[]>;
}
