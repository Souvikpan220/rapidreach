global.__visits = global.__visits || [];
global.__orders = global.__orders || [];

/* -------- HELPERS -------- */
async function sendToDiscord(payload){
  if(!process.env.DISCORD_WEBHOOK_URL) return;

  await fetch(process.env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

async function getCountryFromIP(ip){
  try{
    const r = await fetch(`https://ipapi.co/${ip}/json/`);
    const d = await r.json();
    return {
      country: d.country_name || "Unknown",
      code: d.country_code || "??"
    };
  }catch{
    return { country: "Unknown", code: "??" };
  }
}

/* -------- HANDLER -------- */
export default async function handler(req, res){

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

  const location = await getCountryFromIP(ip);

  // save visit
  global.__visits.push({
    ip,
    country: location.country,
    time: Date.now()
  });

  // send visitor to discord
  await sendToDiscord({
    embeds: [{
      title: "👀 New Website Visitor",
      color: 0x3498db,
      fields: [
        { name: "IP", value: ip, inline: true },
        { name: "Country", value: `${location.country} (${location.code})`, inline: true },
        { name: "Time", value: new Date().toLocaleString(), inline: false }
      ]
    }]
  });

  const now = Date.now();
  const last24h = global.__visits.filter(
    v => now - v.time < 86400000
  );

  res.status(200).json({
    users: 0,
    orders: global.__orders.length,
    tiktok: global.__orders.filter(o => o.platform === "tiktok").length,
    instagram: global.__orders.filter(o => o.platform === "instagram").length,
    recent: global.__orders.slice(-10),

    totalVisits: global.__visits.length,
    last24hVisits: last24h.length,
    recentIPs: last24h.slice(-10).map(v => ({
      ip: v.ip,
      country: v.country
    }))
  });
}
