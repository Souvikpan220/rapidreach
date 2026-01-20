global.__visits = global.__visits || [];

export default function (req, res) {
  // OPTIONAL token check (kept light)
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

  global.__visits.push({
    ip,
    time: Date.now()
  });

  const now = Date.now();
  const last24h = global.__visits.filter(
    v => now - v.time < 86400000
  );
  
const ip =
  req.headers["x-forwarded-for"]?.split(",")[0] ||
  req.socket.remoteAddress;

global.__visits.push({
  ip,
  time: Date.now()
});

const now = Date.now();
const last24h = global.__visits.filter(
  v => now - v.time < 86400000
);

  res.json({
    // existing dashboard stats (safe defaults)
    users: 0,
    orders: global.__orders.length,
    tiktok: global.__orders.filter(o => o.platform === "tiktok").length,
    instagram: global.__orders.filter(o => o.platform === "instagram").length,
    recent: global.__orders.slice(-10),
    totalVisits: global.__visits.length,
    last24hVisits: last24h.length,
    recentIPs: last24h.slice(-10).map(v => v.ip),


    // NEW stats
    totalVisits: global.__visits.length,
    last24hVisits: last24h.length,
    recentIPs: last24h.slice(-10).map(v => v.ip)
  });
}

