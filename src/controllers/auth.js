import {
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
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
