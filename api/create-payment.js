export default async function handler(req,res){

  const { service, qty, price, link, currency } = req.body;

  /* CREATE NOWPAYMENTS INVOICE */
  const response = await fetch(
    "https://api.nowpayments.io/v1/invoice",
    {
      method:"POST",
      headers:{
        "x-api-key":process.env.NOWPAYMENTS_KEY,
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        price_amount: price,
        price_currency: currency || "usd",
        order_id: Date.now(),
        order_description: `${service} ${qty}`,
        success_url:"https://yourdomain.com/success"
      })
    }
  );

  const data = await response.json();

  /* SEND TO DISCORD */
  await fetch("YOUR_DISCORD_WEBHOOK",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({
      embeds:[{
        title:"🛒 New Order",
        color:5814783,
        fields:[
          {name:"Service",value:service},
          {name:"Quantity",value:qty.toString()},
          {name:"Price",value:`${price} ${currency}`},
          {name:"Link",value:link}
        ],
        timestamp:new Date()
      }]
    })
  });

  res.json({ invoice_url:data.invoice_url });
}
