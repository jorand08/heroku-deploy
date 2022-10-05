const dotenv = require("dotenv");
const { AppError } = require("../utils/appError.util");

dotenv.config({ path: "./config.env" });

const sendErrorDev = (error, req, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
    error,
  });
};

const sendErrorProd = (error, req, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message || "something went wrong",
  });
};

//errors catch
tokenExpiredError = () => {
  return new AppError("Session expired", 403);
};

tokenInvalidSignature = () => {
  return new AppError("session Invalid", 403);
};

dbUniqueConstrainError = () => {
  return new AppError("mail already exists", 400);
};

validationError = () => {
  return new AppError("entered a null value", 400);
};

const ImgLimitError = () => {
  return new AppError("You can only upload  3 images", 400);
};

const globalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "fail";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let err = { ...error };

    //When error is about expired token
    if (error.name === "TokenExpiredError") err = tokenExpiredError();
    else if (error.name === "JsonWebTokenError") err = tokenInvalidSignature();
    else if (error.name === "SequelizeUniqueConstraintError")
      err = dbUniqueConstrainError();
    else if (error.name === "SequelizeValidationError") err = validationError();
    else if (error.code === "LIMIT_UNEXPECTED_FILE") err = ImgLimitError();
    err = sendErrorProd(err, req, res);
  }
};

module.exports = { globalErrorHandler };
