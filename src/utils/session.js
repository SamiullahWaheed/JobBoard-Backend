const crypto = require("crypto");

const ONE_DAY_SECONDS = 60 * 60 * 24;

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

function sign(value) {
  const secret = process.env.SESSION_SECRET || "development-session-secret";
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

function createSession(admin) {
  const payload = base64url(
    JSON.stringify({
      sub: admin.id,
      email: admin.email,
      role: admin.role,
      exp: Math.floor(Date.now() / 1000) + ONE_DAY_SECONDS,
    }),
  );
  return `${payload}.${sign(payload)}`;
}

function verifySession(token) {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const suppliedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    suppliedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(suppliedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return session.exp > Math.floor(Date.now() / 1000) ? session : null;
  } catch {
    return null;
  }
}

module.exports = { createSession, verifySession };
