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

  /* ✅ PAYMENT SUCCESS */
  if(req.body.payment_status === "finished"){

    const message = `
💰 NEW PAYMENT RECEIVED

Service: ${req.body.order_description}
Amount: $${req.body.price_amount}
Paid Coin: ${req.body.pay_currency}

TXID: ${req.body.pay_txid}
`;

    /* ✅ SEND TO DISCORD */
    await fetch(process.env.DISCORD_WEBHOOK,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({content:message})
    });

    /* OPTIONAL PREMIUM COOKIE */
    res.setHeader(
      "Set-Cookie",
      "premium=true; Path=/; Max-Age=31536000; SameSite=Lax"
    );
  }

  res.json({ok:true});
}
