export default async function handler(req,res){
  if(req.method !== "POST"){
    return res.status(405).end();
  }

  const r = await fetch("https://api.nowpayments.io/v1/payment",{
    method:"POST",
    headers:{
      "x-api-key": process.env.NOWPAYMENTS_API_KEY,
      "Content-Type":"application/json"
    },

    success_url: `${process.env.SITE_URL}/success.html`,
body: JSON.stringify({
  price_amount: 4.99,
  price_currency: "usd",
  pay_currency: "btc,ltc",
  order_id: "premium_" + Date.now(),
  order_description: "RapidReach Premium",
  ipn_callback_url: `${process.env.SITE_URL}/api/payment-webhook`,
  success_url: `${process.env.SITE_URL}/success.html`
})
  });

  const data = await r.json();
  res.json(data);
}
