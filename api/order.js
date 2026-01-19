import { logOrder } from "./admin-stats.js";
import fetch from "node-fetch";

const cooldown=new Map();

export default async function(req,res){
  const ip=req.headers["x-forwarded-for"]||req.socket.remoteAddress;
  const key=ip+req.body.platform;
  const now=Date.now();

  if(cooldown.has(key)&&now-cooldown.get(key)<15*60*1000){
    return res.json({error:"Cooldown active"});
  }

  cooldown.set(key,now);

  const service=req.body.platform==="tiktok"?2409:2851;

  await fetch("https://falconsmmpanel.com/api/v2",{
    method:"POST",
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      key:process.env.FALCON_API_KEY,
      action:"add",
      service,
      link:req.body.link,
      quantity:100
    })
  });

  res.json({success:true});
}
