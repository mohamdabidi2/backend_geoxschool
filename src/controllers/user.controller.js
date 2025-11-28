const User = require("../models/User");
const { hashPassword } = require("../services/password.service");

async function listUsers(_req, res, next) {
  try {
    const users = await User.find().select("-passwordHash").limit(100);
    res.json({ count: users.length, data: users });
  } catch (error) {
    next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const { username, password, role, name, surname, email, phone } = req.body;

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ error: "Username already in use." });
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      username,
      passwordHash,
      role,
      name,
      surname,
      email,
      phone,
    });

    res.status(201).json({
      message: "User created.",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
        surname: user.surname,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listUsers,
  createUser,
};


