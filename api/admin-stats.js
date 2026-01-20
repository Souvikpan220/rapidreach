global.__visits = global.__visits || [];
global.__orders = global.__orders || [];

export default function handler(req, res) {

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

  // Track visits
  global.__visits.push({
    ip,
    time: Date.now()
  });

  const now = Date.now();
  const last24h = global.__visits.filter(
    v => now - v.time < 86400000
  );

  res.status(200).json({
    users: 0,
    orders: global.__orders.length,
    tiktok: global.__orders.filter(o => o.platform === "tiktok").length,
    instagram: global.__orders.filter(o => o.platform === "instagram").length,
    recent: global.__orders.slice(-10),

    totalVisits: global.__visits.length,
    last24hVisits: last24h.length,
    recentIPs: last24h.slice(-10).map(v => v.ip)
  });
}
