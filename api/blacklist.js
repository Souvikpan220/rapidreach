// api/blacklist.js

// Simple in-memory blacklist (can later be replaced with DB)
const BLACKLISTED_IPS = new Set([
  // example:
  // "123.45.67.89"
]);

export function isBlacklisted(ip) {
  return BLACKLISTED_IPS.has(ip);
}

export function addToBlacklist(ip) {
  BLACKLISTED_IPS.add(ip);
}

export function removeFromBlacklist(ip) {
  BLACKLISTED_IPS.delete(ip);
}
