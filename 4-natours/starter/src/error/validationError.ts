export class ValidationError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.name = 'Validation Error';
    this.status = 400;
    Error.captureStackTrace(this, this.constructor);
  }
}
