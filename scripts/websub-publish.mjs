#!/usr/bin/env node
/**
 * Notify the Google PubSubHubbub WebSub hub that our feeds have updated.
 * Runs as a postdeploy step (see .github/workflows/seo-postdeploy.yml).
 *
 * Per W3C WebSub spec (https://www.w3.org/TR/websub/), publishers POST
 *   hub.mode=publish
 *   hub.url=<feed-url>
 * to the hub. The hub then re-fetches the feed and pushes content to
 * any subscribed clients.
 *
 * No credentials required for the public Google hub. Failures are
 * non-fatal — feeds still work in pull mode without the hub notification.
 */

const HUB = 'https://pubsubhubbub.appspot.com/';
const FEEDS = [
  'https://aimvantage.uk/rss.xml',
  'https://aimvantage.uk/atom.xml',
  'https://aimvantage.uk/feed.json',
];

async function notifyHub(feedUrl) {
  const body = new URLSearchParams({
    'hub.mode': 'publish',
    'hub.url': feedUrl,
  }).toString();
  try {
    const res = await fetch(HUB, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const text = await res.text();
    if (res.ok || res.status === 204) {
      console.log(`[websub] OK ${feedUrl} -> ${res.status}`);
      return true;
    }
    console.warn(`[websub] FAIL ${feedUrl} -> ${res.status} ${text.slice(0, 200)}`);
    return false;
  } catch (err) {
    console.warn(`[websub] error notifying for ${feedUrl}:`, err?.message ?? err);
    return false;
  }
}

async function main() {
  let ok = 0;
  for (const f of FEEDS) {
    if (await notifyHub(f)) ok += 1;
  }
  console.log(`[websub] published ${ok}/${FEEDS.length} feeds.`);
  // Always exit 0 — WebSub failures must not break the deploy chain.
  process.exit(0);
}

main();
