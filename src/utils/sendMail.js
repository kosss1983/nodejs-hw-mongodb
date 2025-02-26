import nodemailer from "nodemailer";
import { getEnvVar } from "../utils/getEnvVar.js";
import createHttpError from "http-errors";

const transporter = nodemailer.createTransport({
  host: getEnvVar("SMTP_HOST"),
  port: Number(getEnvVar("SMTP_PORT")),
  auth: {
    user: getEnvVar("SMTP_USER"),
    pass: getEnvVar("SMTP_PASSWORD"),
  },
});

export const sendEmail = async (options) => {
  try {
    await transporter.sendMail(options);
  } catch (error) {
    throw createHttpError(
      500,
      "Failed to send the email, please try again later.",
      { errors: error.details }
    );
  }
};
