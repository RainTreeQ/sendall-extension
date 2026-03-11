const CLOUD_SELECTORS_URL = 'https://raw.githubusercontent.com/sendol/selectors/main/selectors.json';
const CACHE_KEY = 'aib_dynamic_selectors';
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours

export async function fetchAndCacheSelectors() {
  try {
    const response = await fetch(CLOUD_SELECTORS_URL);
    if (!response.ok) throw new Error('Failed to fetch selectors');
    const data = await response.json();
    await chrome.storage.local.set({
      [CACHE_KEY]: {
        data,
        timestamp: Date.now()
      }
    });
    return data;
  } catch (err) {
    console.warn('[AIB] Failed to fetch dynamic selectors:', err);
    return null;
  }
}
