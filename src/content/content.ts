import { KnownKanji } from 'types.js';

class Main {
  private interval: NodeJS.Timeout | null;

  constructor() {
    this.interval = null;
  }

  public init(knownKanji: KnownKanji[]) {
    console.log('Started!');
    const kanji = knownKanji.map((kk) => kk.character);
    this.interval = setInterval(() => this.action(kanji), 2000);
  }

  private action(kanji: string[]) {
    const guid = crypto.randomUUID();

    const textNodes: Text[] = this.walkOver();

    console.log('length', textNodes.length);
    console.log(textNodes);

    // textNodes.forEach((x) => console.log(x.data, x.parentElement));

    loop: for (const x of textNodes) {
      for (const [index, y] of x.data.split('').entries()) {
        if (kanji.includes(y)) {
          console.log(guid);
          const range = document.createRange();
          console.log(x);
          range.setStart(x, index);
          range.setEnd(x, index + 1);
          const mark = document.createElement('span');
          mark.classList.add('dsnm-highlight');
          range.surroundContents(mark);
          this.action(kanji);
          break loop;
        }
      }
    }

    // console.log(ranges);
    // ranges.forEach(({ node, start }) => {
    //   console.log('===');
    //   console.log(start);
    //   console.log(node.textContent);
    //   const rangeDOM = document.createRange();
    //   rangeDOM.setStart(node, start);
    //   rangeDOM.setEnd(node, start + 1);
    //   const mark = document.createElement('mark');
    //   rangeDOM.surroundContents(mark);
    // });
  }

  private walkOver = () => {
    const arr = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    );

    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      if (
        node.nodeType === Node.TEXT_NODE &&
        !node.parentElement?.classList.contains('dsnm-highlight') &&
        !node.nextElementSibling?.classList.contains('dsnm-highlight')
      ) {
        // or 11904
        // 19968 to 40959
        if (
          node.data.split('').some((x) => {
            const y = x.codePointAt(0);
            return y && y > 11904 && y < 40959;
          })
        ) {
          arr.push(node as Text);
        }
      }
    }
    return arr;
  };
}

const main = new Main();
// chrome.runtime.onMessage.addListener(function (request) {
//   console.log(request);
//   if (request.command === 'data-ready') {
//     console.log('xd');
//   }
//   // VERY IMPORTANT
//   return true;
// });

// (async () => {
//   const x = await chrome.runtime.sendMessage({ greeting: 'hello' });
//   console.log(x);
// })();

// const port = chrome.runtime.connect({ name: 'knockknock' });
// port.postMessage({ joke: 'Knock knock' });
// port.onMessage.addListener(async (msg) => {
//   if (msg.question === 'xxx') console.log(msg.data);
// });

const port = chrome.runtime.connect({ name: 'message-channel' });
window.addEventListener('load', () => {
  console.log('1');
  port.postMessage({ command: 'get-data' });
  port.onMessage.addListener((msg) => {
    console.log('2');
    if (msg.command === 'data-ready') {
      main.init(msg.data);
    }
  });
});
