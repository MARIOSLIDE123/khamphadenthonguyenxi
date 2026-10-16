/**
 * Service to sync with Google Apps Script Web App (connected to Google Sheets)
 * Runs server-side only in Vercel functions or Express server.ts.
 */

export async function forwardToGoogleAppsScript(action: string, payload: Record<string, any>): Promise<any> {
  const scriptUrl =
    process.env.APPS_SCRIPT_URL ||
    'https://script.google.com/macros/s/AKfycbyd-ezIIFWAIZYDSyiBxi7tHY8yXERU2dqtGwJFWJfys3oNEYU3J0Hb9iT6Rt4rttcq/exec';
  const secret = process.env.APPS_SCRIPT_SECRET || '';

  if (!scriptUrl) {
    return null;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action,
        secret,
        payload,
        timestamp: new Date().toISOString()
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (response.ok) {
      return await response.json();
    }
  } catch (err: any) {
    console.warn(`[GoogleAppsScript Sync Warning] Failed to sync action "${action}":`, err?.message || err);
  }

  return null;
}
