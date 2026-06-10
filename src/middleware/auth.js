const Admin = require("../models/Admin");
const { verifySession } = require("../utils/session");

async function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    const session = verifySession(token);

    if (!session || session.role !== "admin") {
      return res.status(401).json({ message: "Admin authentication required." });
    }

    const admin = await Admin.findById(session.sub);
    if (!admin) return res.status(401).json({ message: "Admin account no longer exists." });

    req.admin = admin;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = requireAdmin;
