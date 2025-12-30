import { JobId } from "./JobId";

export type JobDetails = {
  jobId: string;
  title: string;
  author: string;
  postedDate: Date;
  description: string;
};

export class Job {
  private readonly jobId: JobId;
  private title: string;
  private author: string;
  private postedDate: Date;
  private description: string;

  constructor(
    jobId: JobId,
    title: string,
    author: string,
    postedDate: Date,
    description: string
  ) {
    this.jobId = jobId;
    this.title = title;
    this.author = author;
    this.postedDate = postedDate;
    this.description = description;
  }

  updateDetails(title: string, description: string): void {
    this.title = title;
    this.description = description;
  }

  getDetails(): JobDetails {
    return {
      jobId: this.jobId.toString(),
      title: this.title,
      author: this.author,
      postedDate: this.postedDate,
      description: this.description,
    };
  }
}
