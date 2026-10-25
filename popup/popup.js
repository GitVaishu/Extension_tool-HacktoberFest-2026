// Cross-browser: Chrome/Edge only expose `chrome`
if (typeof browser === 'undefined') {
  globalThis.browser = chrome;
}
document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`${btn.dataset.tab}-tab`).classList.add('active');
  });
});

function loadAndRenderTrackers() {
  browser.runtime.sendMessage({ type: 'GET_TRACKERS' }).then((trackers) => {
    const countEl = document.getElementById('count');
    const listEl = document.getElementById('trackerList');
    listEl.innerHTML = '';

    if (trackers.length === 0) {
      countEl.textContent = 'No known trackers detected on this page.';
      return;
    }

    countEl.textContent = `${trackers.length} tracker${trackers.length === 1 ? '' : 's'} found:`;
    trackers.forEach((tracker) => {
      const li = document.createElement('li');
      const name = tracker.name || tracker;
      const category = tracker.category || '';
      li.innerHTML = category ? `${name} <span class="tag">${category}</span>` : name;
      listEl.appendChild(li);
    });
  });
}

function loadInfo() {
  const manifest = browser.runtime.getManifest();
  document.getElementById('infoVersion').textContent = manifest.version;

  fetch(browser.runtime.getURL('blocklist.json'))
    .then((res) => res.json())
    .then((blocklist) => {
      document.getElementById('infoBlocklistCount').textContent = blocklist.length;

      const categories = new Set(
        blocklist.map((t) => t.category).filter(Boolean)
      );
      document.getElementById('infoCategories').textContent =
        categories.size > 0 ? [...categories].join(', ') : 'none set';
    });
}

loadAndRenderTrackers();
loadInfo();