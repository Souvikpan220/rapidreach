import jwt from "jsonwebtoken";

global.users = global.users || [];

export default function(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { email, password } = req.body;

  const user = global.users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
}
