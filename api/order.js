import fs from "fs";
import path from "path";

const blacklistPath = path.join(process.cwd(), "api", "blacklist.json");

function getBlacklist(){
  try{
    const data = fs.readFileSync(blacklistPath, "utf8");
    return JSON.parse(data).ips || [];
  }catch{
    return [];
  }
}

import { isBlacklisted } from "./blacklist.js";

const ip =
  req.headers["x-forwarded-for"]?.split(",")[0] ||
  req.socket.remoteAddress;

const blacklist = getBlacklist();

if (isBlacklisted(ip)) {
  return res.status(403).json({
    blacklisted: true,
    message: "You are blacklisted"
  });
}


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { platform, link } = req.body;

  if (!platform || !link) {
    return res.status(400).json({ error: "Missing platform or link" });
  }

  const SERVICE_IDS = {
    tiktok: 2409,
    instagram: 2506
  };

  const service = SERVICE_IDS[platform];
  if (!service) {
    return res.status(400).json({ error: "Invalid platform" });
  }

  /* ----------------- IP & COUNTRY DETECTION (ADDED) ----------------- */
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

  let country = "Unknown";
  let countryCode = "??";

  try {
    const geo = await fetch(`https://ipapi.co/${ip}/json/`);
    const geoData = await geo.json();
    country = geoData.country_name || country;
    countryCode = geoData.country_code || countryCode;
  } catch {}

  /* ----------------- DISCORD LOG HELPER (ADDED) ----------------- */
  async function sendToDiscord(payload) {
    if (!process.env.DISCORD_WEBHOOK_URL) return;
    await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }

  try {
    const params = new URLSearchParams();
    params.append("key", process.env.FALCON_API_KEY);
    params.append("action", "add");
    params.append("service", service);
    params.append("link", link);
    params.append("quantity", 100);

    const response = await fetch("https://falconsmmpanel.com/api/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error });
    }

    /* ----------------- SEND ORDER LOG TO DISCORD (ADDED) ----------------- */
    await sendToDiscord({
      embeds: [
        {
          title: "📦 New Order Placed",
          color: 0xf5c77a,
          fields: [
            { name: "Platform", value: platform, inline: true },
            { name: "Country", value: `${country} (${countryCode})`, inline: true },
            { name: "IP", value: ip, inline: false },
            { name: "Link", value: link, inline: false },
            { name: "Order ID", value: String(data.order), inline: true },
            { name: "Time", value: new Date().toLocaleString(), inline: false }
          ]
        }
      ]
    });

    return res.json({
      success: true,
      order_id: data.order
    });

  } catch (err) {
    return res.status(500).json({ error: "Falcon API connection failed" });
  }
}


