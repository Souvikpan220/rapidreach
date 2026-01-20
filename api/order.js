export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { platform, link } = req.body;

  if (!platform || !link) {
    return res.status(400).json({ error: "Missing platform or link" });
  }

  const SERVICE_IDS = {
    tiktok: 2409,
    instagram: 2506
  };

  const service = SERVICE_IDS[platform];
  if (!service) {
    return res.status(400).json({ error: "Invalid platform" });
  }

  try {
    const response = await fetch("https://falconsmmpanel.com/api/v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: process.env.FALCON_API_KEY,
        action: "add",
        service: service,
        link: link,
        quantity: 100
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error });
    }

    return res.json({
      success: true,
      order_id: data.order
    });

  } catch (err) {
    return res.status(500).json({ error: "Falcon API error" });
  }
}
