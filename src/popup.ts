const checkbox = document.querySelector('input') as HTMLInputElement;
chrome.storage.sync.get('running', ({ running }) => {
  checkbox.checked = running;
});

checkbox.addEventListener('click', async (ev: MouseEvent) => {
  const target = ev.target as HTMLInputElement;
  chrome.storage.sync.set({ running: target.checked });
  await sendMessage({
    command: target.checked ? 'start' : 'stop',
  });
});

const sendMessage = async (message: string | object) => {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
  });

  tabs.forEach((tab) => {
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, message);
    }
  });
};
