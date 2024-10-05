const checkbox = document.querySelector('input') as HTMLInputElement;
const button = document.querySelector('button') as HTMLButtonElement;
const warningContainer = document.querySelector('#warning') as HTMLDivElement;

chrome.storage.sync.get('running', ({ running }) => {
  checkbox.checked = running;
});

chrome.storage.sync.get('warning', ({ warning }) => {
  warningContainer.innerText = warning;
});

checkbox.addEventListener('click', async (ev: MouseEvent) => {
  const target = ev.target as HTMLInputElement;
  chrome.storage.sync.set({ running: target.checked });
  await sendMessage({
    command: target.checked ? 'start' : 'stop',
  });
});

button.addEventListener('click', async () => {
  chrome.runtime.sendMessage({
    command: 'refresh-token',
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
