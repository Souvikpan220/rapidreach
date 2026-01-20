async function getCountry(ip){
  try{
    const r = await fetch(`https://ipapi.co/${ip}/json/`);
    const d = await r.json();
    return d.country_name || "Unknown";
  }catch{
    return "Unknown";
  }
}

async function sendToDiscord(payload){
  if(!process.env.DISCORD_WEBHOOK_URL) return;

  await fetch(process.env.DISCORD_WEBHOOK_URL,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify(payload)
  });
}

export default async function handler(req,res){

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

  const country = await getCountry(ip);

  const time = new Date().toLocaleString();

  await sendToDiscord({
    content:
`👀 **Website Visit**
🌍 IP: ${ip}
🏳️ Country: ${country}
🕒 Time: ${time}`
  });

  res.status(204).end();
}
