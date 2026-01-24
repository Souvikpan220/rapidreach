export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const { service, link, quantity } = req.body;
  if (!service || !link || !quantity) {
    return res.status(400).json({ success: false });
  }

  try {
    const response = await fetch("https://falconsmm.com/api/v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: process.env.FALCON_SMM_API_KEY,
        action: "add",
        service,
        link,
        quantity
      })
    });

    const data = await response.json();
    res.status(200).json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false });
  }
}
