export class JobDescription {
  private static readonly MIN = 1;
  private static readonly MAX = 2000;

  private constructor(private readonly value: string) {}

  static create(value: string): JobDescription {
    const trimmed = value.trim();

    if (trimmed.length < this.MIN || trimmed.length > this.MAX) {
      throw new Error(
        `Job description must be between ${this.MIN} and ${this.MAX} characters`
      );
    }

    return new JobDescription(trimmed);
  }

  getValue(): string {
    return this.value;
  }
}
