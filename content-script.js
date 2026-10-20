// Fetch the blocklist bundled with the extension
fetch(browser.runtime.getURL('blocklist.json'))
  .then((response) => response.json())
  .then((blocklist) => {
    const found = detectTrackers(blocklist);
    browser.runtime.sendMessage({ type: 'TRACKERS_FOUND', trackers: found });
  });

function detectTrackers(blocklist) {
  const scripts = document.querySelectorAll('script[src]');
  const matches = [];

  scripts.forEach((script) => {
    const src = script.src.toLowerCase();
    blocklist.forEach((tracker) => {
      const name=tracker.name || tracker;
      if (src.includes(name.toLowerCase())) {
        matches.push(name);
      }
    });
  });

  return [...new Set(matches)]; // remove duplicates
}