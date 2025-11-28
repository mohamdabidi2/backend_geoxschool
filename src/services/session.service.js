const { nanoid } = require("nanoid");
const Session = require("../models/Session");
const { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } = require("../config/constants");

async function createSession(res, user, context = {}) {
  const token = nanoid(48);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  await Session.create({
    token,
    user: user._id,
    expiresAt,
    ...context,
  });

  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS * 1000,
    path: "/",
  });
}

async function findSessionByToken(token) {
  if (!token) return null;
  const session = await Session.findOne({ token }).populate("user");
  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await Session.deleteOne({ _id: session._id });
    return null;
  }
  return session;
}

async function destroySession(token) {
  if (!token) return;
  await Session.deleteMany({ token });
}

function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

module.exports = {
  createSession,
  findSessionByToken,
  destroySession,
  clearSessionCookie,
};


