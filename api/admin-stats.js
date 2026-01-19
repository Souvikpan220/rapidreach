import jwt from "jsonwebtoken";

let stats = {
  users:0,
  orders:0,
  tiktok:0,
  instagram:0,
  recent:[]
};

export function logOrder(data){
  stats.orders++;
  if(data.platform==="tiktok") stats.tiktok++;
  if(data.platform==="instagram") stats.instagram++;
  stats.recent.unshift(data);
  if(stats.recent.length>20) stats.recent.pop();
}

export default function(req,res){
  try{
    jwt.verify(req.headers.authorization,process.env.JWT_SECRET);
    res.json(stats);
  }catch{
    res.status(401).json({error:"Unauthorized"});
  }
}
