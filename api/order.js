import fetch from "node-fetch";

global.cooldowns = global.cooldowns || {};

export default async function(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { platform, link } = req.body;

  if (!platform || !link) {
    return res.json({ error: "Invalid request" });
  }

  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "unknown";

  const key = ip + platform;
  const now = Date.now();

  if (global.cooldowns[key] && now - global.cooldowns[key] < 15 * 60 * 1000) {
    return res.json({ error: "Cooldown active. Try again later." });
  }

  global.cooldowns[key] = now;

  const service =
    platform === "tiktok" ? 2409 : 2851;

  await fetch("https://falconsmmpanel.com/api/v2", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: process.env.FALCON_API_KEY,
      action: "add",
      service,
      link,
      quantity: 100
    })
  });

  res.json({ success: true });
}
