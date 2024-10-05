export class CustomError extends Error {
  constructor(public httpCode?: number, public message: string = 'Server error') {
    super(message);
    this.httpCode = httpCode ?? 500;
  }

  toJSON() {
    return {
      message: this.message,
      status: this.httpCode
    };
  }
}
