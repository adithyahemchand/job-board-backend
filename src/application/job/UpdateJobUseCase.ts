import { JobRepository } from "../../domain/job/JobRepository";
import { JobId } from "../../domain/job/valueObjects/JobId";
import { JobUpdateDTO } from "./dto/JobUpdateDTO";
import { logger } from "../../shared/logger";
import { JobDescription } from "../../domain/job/valueObjects/JobDescription";
import { JobTitle } from "../../domain/job/valueObjects/JobTitle";

export class UpdateJobUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(jobId: string, dto: JobUpdateDTO): Promise<void> {
    let id: JobId;

    try {
      id = new JobId(jobId);
    } catch {
      throw new Error("Job not found");
    }
    const job = await this.jobRepository.findJobById(id);

    if (!job) {
      logger.error(`Attempted to update non-existent job ID: ${jobId}`);
      throw new Error("Job not found");
    }

    // Domain mutation — repository only persists final state
    job.updateDetails(
      JobTitle.create(dto.title),
      JobDescription.create(dto.description)
    );

    logger.info(`Updated job ID: ${jobId}`);
    await this.jobRepository.saveJob(job);
  }
}
