export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const response = await fetch("https://api.nowpayments.io/v1/invoice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NOWPAYMENTS_API_KEY
    },
    body: JSON.stringify({
      price_amount: 4.99,
      price_currency: "usd",
      order_id: "premium_" + Date.now(),
      order_description: "RapidReach Premium Lifetime",
      success_url: "https://rapidreach.fun/premium-success",
      cancel_url: "https://rapidreach.fun"
    })
  });

  const data = await response.json();

  if(!data.invoice_url){
    return res.status(400).json(data);
  }

  res.json({ invoice_url: data.invoice_url });
}
