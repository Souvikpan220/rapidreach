export default function handler(req,res){
  // For now: mark user as premium using cookie
  // Later: replace this with crypto webhook verification

  res.setHeader("Set-Cookie",
    "premium=true; Path=/; Max-Age=31536000; SameSite=Lax"
  );

  res.json({ ok:true });
}
