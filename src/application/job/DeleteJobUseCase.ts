import { JobRepository } from "../../domain/job/JobRepository";
import { JobId } from "../../domain/job/JobId";

export class DeleteJobUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(jobId: string): Promise<void> {
    const id = new JobId(jobId);

    const existingJob = await this.jobRepository.findJobById(id);
    if (!existingJob) {
      // Application rule: deleting a non-existing job is an error
      throw new Error("Job not found");
    }

    await this.jobRepository.deleteJob(id);
  }
}
