// Sendol - Platform Success Rate Stats
// Tracks success/failure rates for each platform to detect degradation early

const STORAGE_KEY = 'aib_platform_stats';
const MAX_DAYS = 7; // Keep 7 days of history

// Initialize or get stats
async function getStats() {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    return result[STORAGE_KEY] || {};
  } catch (e) {
    return {};
  }
}

// Save stats
async function saveStats(stats) {
  try {
    await chrome.storage.local.set({ [STORAGE_KEY]: stats });
  } catch (e) {
    console.debug('[AIB] Failed to save stats:', e);
  }
}

// Get today's date string
function getToday() {
  return new Date().toISOString().split('T')[0];
}

// Record a success/failure event
export async function recordEvent(platform, stage, success, details = {}) {
  const stats = await getStats();
  const today = getToday();
  
  if (!stats[platform]) {
    stats[platform] = {};
  }
  
  if (!stats[platform][today]) {
    stats[platform][today] = {
      inject: { success: 0, fail: 0 },
      send: { success: 0, fail: 0 },
      details: []
    };
  }
  
  const dayStats = stats[platform][today];
  if (dayStats[stage]) {
    dayStats[stage][success ? 'success' : 'fail']++;
  }
  
  // Record failure details (limited to 10 per day per platform)
  if (!success && dayStats.details.length < 10) {
    dayStats.details.push({
      stage,
      timestamp: Date.now(),
      ...details
    });
  }
  
  // Clean old data
  const dates = Object.keys(stats[platform]).sort();
  while (dates.length > MAX_DAYS) {
    delete stats[platform][dates.shift()];
  }
  
  await saveStats(stats);
}

// Calculate success rate for a platform over N days
export async function getSuccessRate(platform, days = 7) {
  const stats = await getStats();
  const platformStats = stats[platform];
  if (!platformStats) return null;
  
  const dates = Object.keys(platformStats).sort().slice(-days);
  let totalSuccess = 0;
  let totalFail = 0;
  
  for (const date of dates) {
    const day = platformStats[date];
    totalSuccess += (day.inject?.success || 0) + (day.send?.success || 0);
    totalFail += (day.inject?.fail || 0) + (day.send?.fail || 0);
  }
  
  const total = totalSuccess + totalFail;
  return total > 0 ? {
    rate: totalSuccess / total,
    total,
    success: totalSuccess,
    fail: totalFail,
    days: dates.length
  } : null;
}

// Get stats for all platforms
export async function getAllStats() {
  const stats = await getStats();
  const result = {};
  
  for (const platform of Object.keys(stats)) {
    result[platform] = await getSuccessRate(platform);
  }
  
  return result;
}

// Clear stats
export async function clearStats() {
  await chrome.storage.local.remove(STORAGE_KEY);
}

// Check if any platform needs attention (rate < threshold)
export async function checkPlatformHealth(threshold = 0.85) {
  const stats = await getStats();
  const alerts = [];
  
  for (const platform of Object.keys(stats)) {
    const rate = await getSuccessRate(platform, 3); // Check last 3 days
    if (rate && rate.total >= 5 && rate.rate < threshold) {
      alerts.push({
        platform,
        rate: rate.rate,
        total: rate.total,
        message: `${platform} 成功率 ${(rate.rate * 100).toFixed(1)}% (${rate.success}/${rate.total})`
      });
    }
  }
  
  return alerts;
}

// Export for background script
if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_PLATFORM_STATS') {
      getAllStats().then(sendResponse);
      return true;
    }
    if (message.type === 'CHECK_PLATFORM_HEALTH') {
      checkPlatformHealth(message.threshold || 0.85).then(sendResponse);
      return true;
    }
    if (message.type === 'CLEAR_PLATFORM_STATS') {
      clearStats().then(() => sendResponse({ success: true }));
      return true;
    }
  });
}
