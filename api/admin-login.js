import jwt from "jsonwebtoken";

export default async function(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  let body = req.body;

  // Fallback for Vercel JSON parsing issues
  if (!body) {
    try {
      body = JSON.parse(await new Promise(resolve => {
        let data = "";
        req.on("data", chunk => data += chunk);
        req.on("end", () => resolve(data));
      }));
    } catch {
      return res.status(400).json({ ok: false });
    }
  }

  if (body.key !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ ok: false });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );

  res.json({ ok: true, token });
}
