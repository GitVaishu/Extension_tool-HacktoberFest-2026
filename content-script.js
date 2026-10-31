
/**
 * Cross-browser compatibility:
 * Chrome and Edge expose the extension API as `chrome`.
 * Firefox exposes it as `browser`.
 */
if (typeof browser === 'undefined') {
  globalThis.browser = chrome;
}

/**
 * Fetch the blocklist bundled with the extension
 * and detect trackers on the current webpage.
 */
fetch(browser.runtime.getURL('blocklist.json'))
  .then((response) => {
    if (!response.ok) {
      throw new Error('Failed to load tracker blocklist');
    }

    return response.json();
  })
  .then((blocklist) => {
    const found = detectTrackers(blocklist);

    browser.runtime.sendMessage({
      type: 'TRACKERS_FOUND',
      trackers: found
    });
  })
  .catch((error) => {
    console.error('Tracker detection failed:', error);
  });

/**
 * Detect known trackers in script and image resources.
 *
 * Supports:
 * - Script elements: <script src="...">
 * - Image elements: <img src="...">
 * - Responsive images: <img srcset="...">
 *
 * Supports plain-string blocklist entries and entries
 * containing a `name` property.
 */
function detectTrackers(blocklist) {
  const resources = document.querySelectorAll(
    'script[src], img[src], img[srcset]'
  );

  const matches = [];

  resources.forEach((resource) => {
    const src = (
      resource.currentSrc ||
      resource.src ||
      ''
    ).toLowerCase();

    if (!src) return;

    blocklist.forEach((tracker) => {
      const trackerDomain = tracker.name || tracker;

      if (typeof trackerDomain !== 'string') return;

      if (src.includes(trackerDomain.toLowerCase())) {
        matches.push(trackerDomain);
      }
    });
  });

  // Remove duplicate tracker names
  return [...new Set(matches)];
}
