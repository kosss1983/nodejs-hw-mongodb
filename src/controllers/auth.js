import {
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
  resetPassword,
  sendResetMail,
} from "../services/auth.js";
import { REFRESH_TOKEN_LIVE } from "../constants/index.js";

/**
 * Setup cookie session
 * @param {*} res
 * @param {*} session
 */
const setupSession = (res, session) => {
  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + REFRESH_TOKEN_LIVE),
  });
  res.cookie("sessionId", session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + REFRESH_TOKEN_LIVE),
  });
};

/**
 * Registration new user
 * @param {*} req
 * @param {*} res
 */
export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: "Successfully registered a user!",
    data: user,
  });
};

/**
 * Authentication user
 * @param {*} req
 * @param {*} res
 */
export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: "Successfully logged in an user!",
    data: {
      accessToken: session.accessToken,
    },
  });
};

/**
 * Refresh user session token
 * @param {*} req
 * @param {*} res
 */
export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: "Successfully refreshed a session!",
    data: {
      accessToken: session.accessToken,
    },
  });
};

/**
 * Logout user
 * @param {*} req
 * @param {*} res
 */
export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  // Clear cookies
  res.clearCookie("sessionId");
  res.clearCookie("refreshToken");

  res.status(204).send();
};

/**
 * Send email for reset password
 * @param {*} req
 * @param {*} res
 */
export const sendResetEmailController = async (req, res) => {
  await sendResetMail(req.body.email);

  res.json({
    status: 200,
    message: "Reset password email has been successfully sent.",
    data: {},
  });
};

/**
 * Reset password
 * @param {*} req
 * @param {*} res
 */
export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  res.json({
    status: 200,
    message: "Password has been successfully reset.",
    data: {},
  });
};
