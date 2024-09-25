import type { KnownKanji } from '../types';

class DOMManipulator {
  private readonly unicodeStart = 11904;
  private readonly unicodeEnd = 40959;
  private readonly highlightClassName = 'dsnm-highlight';
  private readonly lookupKanjiUrl = 'https://www.wanikani.com/kanji';

  constructor() {}

  getTextNodes() {
    const nodes = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    );

    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      if (
        node.nodeType === Node.TEXT_NODE &&
        !node.parentElement?.classList.contains(this.highlightClassName) &&
        !node.nextElementSibling?.classList.contains(this.highlightClassName)
      ) {
        if (
          node.data.split('').some((char) => {
            const codePoint = char.codePointAt(0);
            return (
              codePoint &&
              codePoint > this.unicodeStart &&
              codePoint < this.unicodeEnd
            );
          })
        ) {
          nodes.push(node as Text);
        }
      }
    }
    return nodes;
  }

  markKnownKanji(kanji: string[]) {
    const nodes = this.getTextNodes();
    loop: for (const node of nodes) {
      for (const [index, char] of node.data.split('').entries()) {
        if (kanji.includes(char)) {
          //   console.log(guid);
          //   console.log(x);
          this.highlightNode(node, index, char);
          this.markKnownKanji(kanji);
          break loop;
        }
      }
    }
  }

  private highlightNode(node: Text, index: number, char: string) {
    const range = document.createRange();
    range.setStart(node, index);
    range.setEnd(node, index + 1);
    const mark = document.createElement('span');
    mark.addEventListener('click', () =>
      window.open(`${this.lookupKanjiUrl}/${char}`, '_blank')
    );
    mark.classList.add(this.highlightClassName);
    mark.classList.add(this.highlightClassName + '--red');
    range.surroundContents(mark);
  }
}

class Runtime {
  private domManipulator: DOMManipulator;
  private port: chrome.runtime.Port;
  private nodesCount: number;
  private interval: ReturnType<typeof setInterval> | null;
  private timeout: number = 1000;

  constructor() {
    this.domManipulator = new DOMManipulator();
    this.port = chrome.runtime.connect({ name: 'message-channel' });
    this.nodesCount = 0;
    this.interval = null;
    this.registerListeners();
  }

  init() {
    this.port.postMessage({ command: 'get-data' });
  }

  start(knownKanji: KnownKanji[]) {
    console.log('Started!');
    const kanji = knownKanji.map((kk) => kk.character);
    this.domManipulator.markKnownKanji(kanji);
    this.interval = setInterval(() => {
      const newNodesCount = this.domManipulator.getTextNodes().length;
      if (newNodesCount !== this.nodesCount) {
        this.nodesCount = newNodesCount;
        this.domManipulator.markKnownKanji(kanji);
      }
    }, this.timeout);
  }

  stop() {
    console.log('Stoped!');
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private registerListeners() {
    chrome.runtime.onMessage.addListener((msg) => {
      console.log(msg);
      if (msg.command === 'start') {
        this.start(msg.data);
      }
      if (msg.command === 'stop') {
        this.stop();
      }
    });
    this.port.onMessage.addListener((msg) => {
      console.log('Got messasge from SW');
      if (msg.command === 'data-ready') {
        chrome.storage.sync.get('state', ({ state }) => {
          if (state) {
            this.start(msg.data);
          }
        });
      }
    });
  }
}

window.addEventListener('load', () => {
  console.log('Window loaded');
  const runtime = new Runtime();
  runtime.init();
});
