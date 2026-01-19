global.users = global.users || [];

export default function(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ error: "Missing email or password" });
  }

  const exists = global.users.find(u => u.email === email);
  if (exists) {
    return res.json({ error: "User already exists" });
  }

  global.users.push({ email, password });

  res.json({ success: true });
}
