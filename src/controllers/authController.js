const Admin = require("../models/Admin");
const { verifyPassword } = require("../utils/password");
const { createSession } = require("../utils/session");

async function login(req, res) {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const admin = await Admin.findOne({ email }).select("+passwordHash");
  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  res.json({
    token: createSession(admin),
    admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
  });
}

async function me(req, res) {
  res.json({
    admin: {
      id: req.admin.id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
    },
  });
}

module.exports = { login, me };
