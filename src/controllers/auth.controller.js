const User = require("../models/User");
const { hashPassword, verifyPassword } = require("../services/password.service");
const {
  createSession,
  destroySession,
  clearSessionCookie,
} = require("../services/session.service");
const { SESSION_COOKIE } = require("../config/constants");

async function bootstrapAdmin(req, res, next) {
  try {
    const { secretKey, username, password, name } = req.body;
    const expectedSecret = process.env.ADMIN_SETUP_SECRET;

    if (!expectedSecret) {
      return res
        .status(500)
        .json({ error: "ADMIN_SETUP_SECRET missing in environment." });
    }

    if (secretKey !== expectedSecret) {
      return res.status(403).json({ error: "Invalid secret key." });
    }

    const existingAdmin = await User.exists({ role: "ADMIN" });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ error: "An admin already exists. Login instead." });
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      username,
      passwordHash,
      role: "ADMIN",
      name,
    });

    await createSession(res, user);

    res.status(201).json({
      message: "Admin account created.",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    await createSession(res, user, {
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    });

    res.json({
      message: "Login successful.",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function me(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return res.json({ user: req.user });
}

async function logout(req, res, next) {
  try {
    const token = req.cookies?.[SESSION_COOKIE];
    await destroySession(token);
    clearSessionCookie(res);
    res.json({ message: "Logged out." });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  bootstrapAdmin,
  login,
  me,
  logout,
};


