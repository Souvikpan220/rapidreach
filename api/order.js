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
  if(req.method !== "POST"){
    return res.status(405).json({ ok:false });
  }

  let raw = "";
  for await (const chunk of req){
    raw += chunk;
  }

  let body;
  try{
    body = JSON.parse(raw);
  }catch{
    return res.status(400).json({ ok:false });
  }

  const { platform, link } = body;

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

  const location = await getCountryFromIP(ip);

  const order = {
    platform,
    link,
    ip,
    country: location.country,
    time: Date.now()
  };

  global.__orders.push(order);

  // send order to discord
  await sendToDiscord({
    embeds: [{
      title: "📦 New Order Received",
      color: 0xf5c77a,
      fields: [
        { name: "Platform", value: platform, inline: true },
        { name: "Country", value: `${location.country} (${location.code})`, inline: true },
        { name: "IP", value: ip, inline: true },
        { name: "Link", value: link, inline: false },
        { name: "Time", value: new Date().toLocaleString(), inline: false }
      ]
    }]
  });

  res.status(200).json({ ok:true });
}
