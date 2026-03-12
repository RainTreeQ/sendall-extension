// Sendol - Content Script Lifecycle Management
// Tracks all event listeners and observers for cleanup on page unload.

const cleanupFns = [];

export function onCleanup(fn) {
  if (typeof fn === 'function') cleanupFns.push(fn);
}

export function runCleanup() {
  while (cleanupFns.length) {
    try { cleanupFns.pop()(); } catch (e) {}
  }
}

// Auto-cleanup on page unload
window.addEventListener('pagehide', runCleanup, { once: true });
window.addEventListener('beforeunload', runCleanup, { once: true });
