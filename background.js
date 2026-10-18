function getBadgeColor(count) {
  if (count === 0) return '#2e7d32';   // green
  if (count <= 3) return '#f9a825';    // yellow/orange
  return '#c62828';                    // red
}

let trackersByTab = {};

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TRACKERS_FOUND') {
    trackersByTab[sender.tab.id] = message.trackers;
    browser.action.setBadgeText({
      text: String(message.trackers.length),
      tabId: sender.tab.id,
    });
    browser.action.setBadgeBackgroundColor({
      color: getBadgeColor(message.trackers.length),
      tabId: sender.tab.id,
    });
  }

  if (message.type === 'GET_TRACKERS') {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const currentTabId = tabs[0].id;
      sendResponse(trackersByTab[currentTabId] || []);
    });
    return true;
  }
});