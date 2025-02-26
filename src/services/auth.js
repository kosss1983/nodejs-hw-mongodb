import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import createHttpError from "http-errors";
import { UsersCollection } from "../db/models/user.js";
import { SessionsCollection } from "../db/models/session.js";
import {
  ACCESS_TOKEN_LIVE,
  REFRESH_TOKEN_LIVE,
  TEMPLATES_DIR,
} from "../constants/index.js";
import jwt from "jsonwebtoken";
import fs from "node:fs/promises";
import path from "node:path";
import handlebars from "handlebars";
import { getEnvVar } from "../utils/getEnvVar.js";
import { sendEmail } from "../utils/sendMail.js";

/**
 * Form data for new session
 */
const createSession = () => {
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIVE),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_LIVE),
  };
};

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  // Checking user existence
  if (user) throw createHttpError(409, "Email in use");

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  // Checking user existence
  if (!user) throw createHttpError(401, "User not found");

  const isEqual = await bcrypt.compare(payload.password, user.password);
  // Checking user authorization
  if (!isEqual) throw createHttpError(401, "Unauthorized");

  // Delete old session
  await SessionsCollection.deleteOne({ userId: user._id });

  // Create new session
  const newSession = createSession();

  return await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  // Checking session existence
  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  // Checking token expired
  if (isSessionTokenExpired) {
    throw createHttpError(401, "Session token expired");
  }

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const sendResetMail = async (email) => {
  const user = await UsersCollection.findOne({ email });
  // Checking user existence
  if (!user) {
    throw createHttpError(404, "User not found!");
  }
  // Create reset token
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar("JWT_SECRET"),
    {
      expiresIn: "5m",
    }
  );
  // Create email template path
  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    "send-mail-reset.html"
  );
  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();
  // Create email template
  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${getEnvVar("APP_DOMAIN")}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: getEnvVar("SMTP_FROM"),
    to: email,
    subject: "Reset your password",
    html,
  });
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar("JWT_SECRET"));
  } catch (error) {
    if (error instanceof Error) {
      throw createHttpError(401, "Token is expired or invalid.", {
        errors: error.details,
      });
    }
    throw error;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword }
  );
};
