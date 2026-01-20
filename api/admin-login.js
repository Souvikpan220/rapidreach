export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

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

  // simple success flag (no JWT)
  res.json({ ok: true });
}
