/**
 * Keep-Alive Service for Render-hosted backends
 *
 * Render free-tier instances spin down after 15 minutes of inactivity.
 * This lightweight utility sends periodic GET requests to keep backend services awake.
 */

// List of backend URLs to keep awake.
// You can add or remove Render service URLs here.
export const BACKEND_URLS = [
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  // Add any additional Render backend URLs below:
  // 'https://my-backend-service.onrender.com',
];

// Interval: 10 minutes (600,000 milliseconds)
export const KEEP_ALIVE_INTERVAL_MS = 10 * 60 * 1000;

/**
 * Pings all configured backend URLs once.
 * Uses mode: 'no-cors' so requests are sent without CORS preflight failures or console errors,
 * even while services are spinning up.
 */
export const pingBackends = async (urls = BACKEND_URLS) => {
  if (!urls || urls.length === 0) return;

  const pingPromises = urls.map(async (url) => {
    try {
      console.log(`[Keep-Alive] Pinging backend: ${url}`);
      await fetch(url, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-cache',
      });
      console.log(`[Keep-Alive] Ping sent successfully to: ${url}`);
    } catch (error) {
      // Gracefully handle network errors during cold starts
      console.warn(`[Keep-Alive] Ping to ${url} failed (server may be waking up):`, error?.message || error);
    }
  });

  await Promise.allSettled(pingPromises);
};

/**
 * Starts the keep-alive background ping cycle.
 * Fires immediately upon calling, then schedules repeats every 10 minutes.
 * Returns a cleanup function that clears the interval when the component unmounts.
 */
export const startKeepAlive = (urls = BACKEND_URLS, intervalMs = KEEP_ALIVE_INTERVAL_MS) => {
  // 1. Immediate ping on frontend load
  pingBackends(urls);

  // 2. Schedule recurring pings every 10 minutes
  const intervalId = setInterval(() => {
    pingBackends(urls);
  }, intervalMs);

  // 3. Return cleanup callback for unmounting
  return () => {
    clearInterval(intervalId);
  };
};
