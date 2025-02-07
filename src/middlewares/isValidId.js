// Import HttpError class to handle http errors
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  // check if the ID is valid
  if (!isValidObjectId(contactId)) {
    throw createHttpError(400, "Bad Request");
  }

  next();
};
