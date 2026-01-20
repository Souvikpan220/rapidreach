import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  // Read raw body (Vercel-safe)
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
  }

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return res.status(400).json({ ok: false });
  }

  if (!process.env.ADMIN_SECRET) {
    return res.status(500).json({ ok: false });
  }

  if (body.key !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ ok: false });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET || "jwt_fallback",
    { expiresIn: "12h" }
  );

  res.json({ ok: true, token });
}
