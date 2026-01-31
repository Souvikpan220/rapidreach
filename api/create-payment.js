export default async function handler(req,res){

  if(req.method !== "POST"){
    return res.status(405).json({error:"Method not allowed"});
  }

  try{

    const { price = 9.99, service = "Premium Plan" } = req.body || {};

    const r = await fetch("https://api.nowpayments.io/v1/invoice",{
      method:"POST",
      headers:{
        "x-api-key": process.env.NOWPAYMENTS_KEY,
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        price_amount: Number(price),
        price_currency: "usd",
        pay_currency: "btc",
        order_description: service
      })
    });

    const data = await r.json();

    if(!data.invoice_url){
      console.log("NOWPAYMENTS ERROR:", data);
      return res.status(500).json({error:"NowPayments failed"});
    }

    return res.json({invoice_url:data.invoice_url});

  }catch(err){
    console.log(err);
    return res.status(500).json({error:"Server error"});
  }
}
