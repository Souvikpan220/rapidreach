import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const { idp } = req.body;
  if (!idp) {
    return res.status(400).json({ success: false, message: "Missing IDP" });
  }

  const filePath = path.join(process.cwd(), "api", "premium-idps.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const record = data[idp];

  if (!record || !record.active) {
    return res.status(401).json({ success: false, message: "Invalid IDP" });
  }

  const today = new Date();
  const expiry = new Date(record.expires);

  if (expiry < today) {
    return res.status(401).json({ success: false, message: "IDP expired" });
  }

  res.status(200).json({
    success: true,
    username: record.username
  });
}
