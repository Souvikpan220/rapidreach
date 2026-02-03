export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, issue, description } = req.body || {};

    if (!name || !email || !issue || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const webhookUrl = process.env.discordwebhookticket;

    if (!webhookUrl) {
      return res.status(500).json({ error: "Webhook not configured" });
    }

    const message = {
      content: "🎫 **NEW SUPPORT TICKET**",
      embeds: [
        {
          color: 0x00ff99,
          fields: [
            { name: "👤 Name", value: name, inline: true },
            { name: "📧 Email", value: email, inline: true },
            { name: "📌 Issue", value: issue },
            { name: "📝 Description", value: description }
          ],
          footer: {
            text: "RapidReach Support System"
          },
          timestamp: new Date()
        }
      ]
    };

    const discordRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    });

    if (!discordRes.ok) {
      throw new Error("Discord webhook failed");
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Failed to submit ticket" });
  }
}
