const checkbox = document.querySelector('input') as HTMLInputElement;
chrome.storage.sync.get('state', ({ state }) => {
  checkbox.checked = state;
});

checkbox.addEventListener('click', async (ev: MouseEvent) => {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  if (!tab?.id) return;
  const target = ev.target as HTMLInputElement;
  chrome.storage.sync.set({ state: target.checked });
  chrome.tabs.sendMessage(tab.id, {
    command: target.checked ? 'start' : 'stop',
  });
});
