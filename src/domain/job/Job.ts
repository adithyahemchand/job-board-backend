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

  // Validation constraints
  private static readonly TITLE_MIN = 1;
  private static readonly TITLE_MAX = 100;
  private static readonly AUTHOR_MIN = 1;
  private static readonly AUTHOR_MAX = 50;
  private static readonly DESCRIPTION_MIN = 1;
  private static readonly DESCRIPTION_MAX = 2000;

  constructor(
    jobId: JobId,
    title: string,
    author: string,
    postedDate: Date,
    description: string
  ) {
    this.validateFields(title, author, description);

    this.jobId = jobId;
    this.title = title;
    this.author = author;
    this.postedDate = postedDate;
    this.description = description;
  }

  updateDetails(title: string, description: string): void {
    this.validateFields(title, this.author, description);

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

  // Validation method
  private validateFields(
    title: string,
    author: string,
    description: string
  ): void {
    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();
    const trimmedDescription = description.trim();

    if (
      trimmedTitle.length < Job.TITLE_MIN ||
      trimmedTitle.length > Job.TITLE_MAX
    ) {
      throw new Error(
        `Job title must be between ${Job.TITLE_MIN} and ${Job.TITLE_MAX} characters`
      );
    }

    if (
      trimmedAuthor.length < Job.AUTHOR_MIN ||
      trimmedAuthor.length > Job.AUTHOR_MAX
    ) {
      throw new Error(
        `Job author must be between ${Job.AUTHOR_MIN} and ${Job.AUTHOR_MAX} characters`
      );
    }

    if (
      trimmedDescription.length < Job.DESCRIPTION_MIN ||
      trimmedDescription.length > Job.DESCRIPTION_MAX
    ) {
      throw new Error(
        `Job description must be between ${Job.DESCRIPTION_MIN} and ${Job.DESCRIPTION_MAX} characters`
      );
    }
  }
}
