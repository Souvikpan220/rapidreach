import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const { hotkey } = req.body;
  if (!hotkey) {
    return res.status(400).json({ success: false });
  }

  const filePath = path.join(process.cwd(), "api", "premium-idps.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (data.keys.includes(hotkey)) {
    return res.json({ success: true });
  }

  return res.json({ success: false });
}
