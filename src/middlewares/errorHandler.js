// Import HttpError class to handle http errors
import { HttpError } from "http-errors";

export const errorHandler = (err, req, res, next) => {
  // checking http errors
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.name,
      data: err,
    });
    return;
  }

  // send status and error message
  res.status(500).json({
    status: 500,
    message: "Something went wrong",
    data: err.message,
  });
};
