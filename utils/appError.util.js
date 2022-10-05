class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.message = message;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'error' : 'fail';

    //capture the error stack and add in to the AppError instance
    Error.captureStackTrace(this);
  }
}
module.exports = { AppError };
