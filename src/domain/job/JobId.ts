import { randomUUID } from "node:crypto";

export class JobId {
  private readonly id: string;

  constructor(id: string) {
    if (!id || id.trim() === "") {
      throw new Error("JobId cannot be empty");
    }
    this.id = id;
  }

  static generate(): JobId {
    return new JobId(randomUUID());
  }

  toString(): string {
    return this.id;
  }

  equals(other: JobId): boolean {
    return this.id === other.id.toString();
  }
}
