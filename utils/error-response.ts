export class ErrorResponse extends Error {
  statusCode: number;

  constructor(statusCode = 500, message = "Unexpected server error") {
    super(message);
    this.statusCode = statusCode;
  }
}
