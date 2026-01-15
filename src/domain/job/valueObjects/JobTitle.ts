export class JobTitle {
  private static readonly MIN = 1;
  private static readonly MAX = 100;

  private constructor(private readonly value: string) {}

  static create(value: string): JobTitle {
    const trimmed = value.trim();

    if (trimmed.length < this.MIN || trimmed.length > this.MAX) {
      throw new Error(
        `Job title must be between ${this.MIN} and ${this.MAX} characters`
      );
    }

    return new JobTitle(trimmed);
  }

  getValue(): string {
    return this.value;
  }
}
