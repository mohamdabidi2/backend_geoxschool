const {
  findSessionByToken,
  destroySession,
  clearSessionCookie,
} = require("../services/session.service");
const { SESSION_COOKIE } = require("../config/constants");

async function attachUser(req, res, next) {
  try {
    const token = req.cookies?.[SESSION_COOKIE];
    if (!token) {
      req.user = null;
      return next();
    }

    const session = await findSessionByToken(token);
    if (!session) {
      await destroySession(token);
      clearSessionCookie(res);
      req.user = null;
      return next();
    }

    req.user = {
      id: session.user._id.toString(),
      username: session.user.username,
      role: session.user.role,
      name: session.user.name,
      surname: session.user.surname,
    };
    req.sessionId = session._id.toString();
    return next();
  } catch (error) {
    console.error("attachUser failed:", error);
    req.user = null;
    return next();
  }
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return next();
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    return next();
  };
}

module.exports = {
  attachUser,
  requireAuth,
  requireRole,
};


