export class CustomError extends Error {
  constructor(public message: string = 'Server error', public httpCode?: number) {
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
