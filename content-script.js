// Fetch the blocklist bundled with the extension
fetch(browser.runtime.getURL('blocklist.json'))
  .then((response) => response.json())
  .then((blocklist) => {
    const found = detectTrackers(blocklist);
    browser.runtime.sendMessage({ type: 'TRACKERS_FOUND', trackers: found });
  });

  
function detectTrackers(blocklist) {
  // Find scripts and images loaded on the current webpage
  const resources = document.querySelectorAll(
    'script[src], img[src], img[srcset]'
  );

  const matches = [];

  resources.forEach((resource) => {
    // Use the selected image URL when available
    const src = resource.currentSrc || resource.src;

    if (!src) return;

    blocklist.forEach((tracker) => {
      // Support both plain domain strings and named entries
      const trackerDomain = tracker.name || tracker;

      if (
        typeof trackerDomain === 'string' &&
        src.includes(trackerDomain)
      ) {
        matches.push(trackerDomain);
      }
    });
  });

  // Remove duplicate tracker names
  return [...new Set(matches)];
}

// Fetch the blocklist bundled with the extension
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


 

