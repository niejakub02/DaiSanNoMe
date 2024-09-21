import { Program } from './Program.js';

// type Tab = chrome.tabs.Tab;

// const getFile = (filepath: string) => `dist/${filepath}`;
// const CACHE_NAME = 'dai-san-no-me-cache';
// const FETCH_URL = 'https://jsonplaceholder.typicode.com/todos/1';
// chrome.runtime.onInstalled.addListener(async () => {
//   const cache = await caches.open(CACHE_NAME);
//   cache.add(FETCH_URL);
//   chrome.action.setBadgeText({
//     text: 'OFF',
//   });
// });

// const extensions = 'https://developer.chrome.com/docs/extensions';
// const webstore = 'https://developer.chrome.com/docs/webstore';

// chrome.action.onClicked.addListener(async (tab: Tab) => {
//   if (
//     tab.id &&
//     (tab.url?.startsWith(extensions) || tab.url?.startsWith(webstore))
//   ) {
//     // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
//     const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
//     // Next state will always be the opposite
//     const nextState = prevState === 'ON' ? 'OFF' : 'ON';

//     // Set the action badge to the next state
//     await chrome.action.setBadgeText({
//       tabId: tab.id,
//       text: nextState,
//     });

//     if (nextState === 'ON') {
//       // Insert the CSS file when the user turns the extension on
//       await chrome.scripting.insertCSS({
//         files: [getFile('styles/focus-mode.css')],
//         target: { tabId: tab.id },
//       });
//     } else if (nextState === 'OFF') {
//       // Remove the CSS file when the user turns the extension off
//       await chrome.scripting.removeCSS({
//         files: [getFile('styles/focus-mode.css')],
//         target: { tabId: tab.id },
//       });
//     }
//   }
// });

const program = new Program();
program.init();

// (async () => {
//   setInterval(async () => {
//     console.log(
//       await httpClient.get('https://jsonplaceholder.typicode.com/todos/1')
//     );
//   }, 5000);
// })();
