console.log('???');
document.querySelector('button')?.addEventListener('click', () => {
  chrome.runtime.sendMessage({ command: 'clear-storage' });
});
