import { JobId } from "./valueObjects/JobId";
import { JobTitle } from "./valueObjects/JobTitle";
import { JobAuthor } from "./valueObjects/JobAuthor";
import { JobDescription } from "./valueObjects/JobDescription";

export class Job {
  private readonly jobId: JobId;
  private title: JobTitle;
  private author: JobAuthor;
  private postedDate: Date;
  private description: JobDescription;

  constructor(
    jobId: JobId,
    title: JobTitle,
    author: JobAuthor,
    postedDate: Date,
    description: JobDescription
  ) {
    this.jobId = jobId;
    this.title = title;
    this.author = author;
    this.postedDate = postedDate;
    this.description = description;
  }
  getId(): JobId {
    return this.jobId;
  }

  getTitle(): JobTitle {
    return this.title;
  }

  getAuthor(): JobAuthor {
    return this.author;
  }

  getPostedDate(): Date {
    return this.postedDate;
  }

  getDescription(): JobDescription {
    return this.description;
  }

  updateDetails(title: JobTitle, description: JobDescription): void {
    this.title = title;
    this.description = description;
  }
}
