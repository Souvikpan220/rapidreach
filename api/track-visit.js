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
      city: d.city || "Unknown",
      code: d.country_code || "??",
      proxy: d.proxy || d.vpn || false
    };
  }catch{
    return {
      country: "Unknown",
      city: "Unknown",
      code: "??",
      proxy: false
    };
  }
}

export default async function handler(req, res){

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "Unknown";

  const userAgent = req.headers["user-agent"] || "Unknown";

  const isMobile = /mobile|android|iphone|ipad/i.test(userAgent)
    ? "Mobile"
    : "Desktop";

  const location = await getCountryFromIP(ip);

  // Basic proxy/VPN detection via headers
  const proxyHeaders = [
    "x-forwarded-for",
    "x-real-ip",
    "via",
    "forwarded"
  ];
  const isProxy =
    location.proxy ||
    proxyHeaders.some(h => req.headers[h]);

  // First visit / returning visitor (cookie-based)
  const cookies = req.headers.cookie || "";
  const isReturning = cookies.includes("visited=true");

  await sendToDiscord({
    embeds: [{
      title: "👀 Website Visit",
      color: 0x3498db,
      fields: [
        { name: "🌍 IP Address", value: ip, inline: true },
        { name: "📱 Device Type", value: isMobile, inline: true },
        { name: "🖥️ Device & Browser", value: userAgent, inline: false },
        { name: "🌐 Location", value: `${location.city}, ${location.country} (${location.code})`, inline: true },
        { name: "🚩 Proxy / VPN", value: isProxy ? "Yes" : "No", inline: true },
        { name: "🧭 Visitor", value: isReturning ? "Returning" : "First Visit", inline: true },
        { name: "🕒 Time", value: new Date().toLocaleString(), inline: false }
      ]
    }]
  });

  // set cookie silently for return detection
  res.setHeader(
    "Set-Cookie",
    "visited=true; Path=/; Max-Age=31536000; SameSite=Lax"
  );

  // no content response (fast & silent)
  res.status(204).end();
}
