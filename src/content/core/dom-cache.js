// Sendol - DOM Node Cache
// Caches frequently-accessed DOM nodes (input, send button) to avoid repeated querySelector.
// Entries are invalidated when the node is disconnected from the DOM or on SPA navigation.

const cache = new Map();
let lastUrl = location.href;

export function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (!entry.node || !entry.node.isConnected) {
    cache.delete(key);
    return null;
  }
  return entry.node;
}

export function setCache(key, node) {
  if (!node) return;
  cache.set(key, { node, cachedAt: Date.now() });
}

export function invalidate(key) {
  if (key) cache.delete(key);
  else cache.clear();
}

// Detect SPA navigation and invalidate all caches
export function checkNavigation() {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    cache.clear();
    return true;
  }
  return false;
}
