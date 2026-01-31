export default async function handler(req,res){

  try{
    const { price } = req.body;

    const response = await fetch(
      "https://api.nowpayments.io/v1/invoice",
      {
        method:"POST",
        headers:{
          "x-api-key":process.env.NOWPAYMENTS_KEY,
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          price_amount: price || 5,
          price_currency: "usd",
          order_id: Date.now(),
          success_url:"https://google.com"
        })
      }
    );

    const data = await response.json();

    return res.json({
      invoice_url:data.invoice_url
    });

  }catch(err){
    console.log(err);
    res.json({ error:"Payment failed" });
  }
}
