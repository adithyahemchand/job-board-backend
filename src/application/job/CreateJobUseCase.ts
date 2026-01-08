import { JobRepository } from "../../domain/job/JobRepository";
import { Job } from "../../domain/job/Job";
import { JobId } from "../../domain/job/JobId";
import { JobCreateDTO } from "./dto/JobCreateDTO";
import { logger } from "../../shared/logger";

export class CreateJobUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(dto: JobCreateDTO): Promise<void> {
    const job = new Job(
      JobId.generate(),
      dto.title,
      dto.author,
      new Date(),
      dto.description
    );

    await this.jobRepository.saveJob(job);
    logger.info(`Job created with ID: ${job.getDetails().jobId}`);
  }
}
