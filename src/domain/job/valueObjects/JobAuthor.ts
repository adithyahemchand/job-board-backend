export class JobAuthor {
  private static readonly MIN = 1;
  private static readonly MAX = 50;

  private constructor(private readonly value: string) {}

  static create(value: string): JobAuthor {
    const trimmed = value.trim();

    if (trimmed.length < this.MIN || trimmed.length > this.MAX) {
      throw new Error(
        `Job author must be between ${this.MIN} and ${this.MAX} characters`
      );
    }

    return new JobAuthor(trimmed);
  }

  getValue(): string {
    return this.value;
  }
}
