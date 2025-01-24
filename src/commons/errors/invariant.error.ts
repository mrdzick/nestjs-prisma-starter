export class InvariantError extends Error {
  public statusCode: number;

  constructor(message, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
