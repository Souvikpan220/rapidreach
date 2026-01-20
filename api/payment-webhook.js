import crypto from "crypto";

export default async function handler(req,res){
  const sig = req.headers["x-nowpayments-sig"];
  const body = JSON.stringify(req.body);

  const hash = crypto
    .createHmac("sha512", process.env.NOWPAYMENTS_IPN_SECRET)
    .update(body)
    .digest("hex");

  if(sig !== hash){
    return res.status(401).end();
  }

  if(req.body.payment_status === "finished"){
    res.setHeader(
      "Set-Cookie",
      "premium=true; Path=/; Max-Age=31536000; SameSite=Lax"
    );
  }

  res.json({ok:true});
}
