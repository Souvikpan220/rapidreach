export default function handler(req,res){
  const premium = req.headers.cookie?.includes("premium=true");
  res.json({ premium: !!premium });
}
