import { JobRepository } from "../../domain/job/JobRepository";
import { JobId } from "../../domain/job/JobId";
import { JobUpdateDTO } from "./dto/JobUpdateDTO";

export class UpdateJobUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(jobId: string, dto: JobUpdateDTO): Promise<void> {
    const id = new JobId(jobId);
    const job = await this.jobRepository.findJobById(id);

    if (!job) {
      throw new Error("Job not found");
    }

    // Domain mutation — repository only persists final state
    job.updateDetails(dto.title, dto.description);

    await this.jobRepository.saveJob(job);
  }
}
