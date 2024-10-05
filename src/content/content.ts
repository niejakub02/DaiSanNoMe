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
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (
            node.nodeType === Node.TEXT_NODE &&
            !(node as Text).parentElement?.classList.contains(
              'dsnm-highlight'
            ) &&
            !(node as Text).nextElementSibling?.classList.contains(
              'dsnm-highlight'
            )
          ) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        },
      }
    );
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
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
    return nodes;
  }

  markKnownKanji(kanji: string[], srsStages: number[]) {
    const nodes = this.getTextNodes();
    loop: for (const node of nodes) {
      for (const [index, char] of node.data.split('').entries()) {
        const kanjiIndex = kanji.indexOf(char);
        if (kanjiIndex >= 0) {
          this.highlightNode(
            node,
            index,
            kanji[kanjiIndex],
            srsStages[kanjiIndex]
          );
          this.markKnownKanji(kanji, srsStages);
          break loop;
        }
      }
    }
  }

  editBodyAttribute(qualifiedName: string, value?: string) {
    const body = document.querySelector('body');
    if (body && value !== undefined) {
      body.setAttribute(qualifiedName, value);
    } else {
      body?.removeAttribute(qualifiedName);
    }
  }

  private highlightNode(
    node: Text,
    index: number,
    char: string,
    srsStage: number
  ) {
    const range = document.createRange();
    range.setStart(node, index);
    range.setEnd(node, index + 1);
    const mark = document.createElement('span');
    mark.addEventListener('click', () =>
      window.open(`${this.lookupKanjiUrl}/${char}`, '_blank')
    );
    mark.classList.add(this.highlightClassName);
    mark.classList.add(this.highlightClassName + `--${srsStage.toString()}`);
    range.surroundContents(mark);
  }
}

class Runtime {
  private domManipulator: DOMManipulator;
  private port: chrome.runtime.Port;
  private nodesCount: number;
  private interval: ReturnType<typeof setInterval> | null;
  private timeout: number = 1000;
  private knownKanji: KnownKanji[] = [];

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

  start() {
    console.log('Started!');
    const kanji: string[] = [];
    const srsStages: number[] = [];
    this.domManipulator.editBodyAttribute('data-dsnm-on', '');
    this.knownKanji.forEach((kk) => {
      kanji.push(kk.character);
      srsStages.push(kk.srs_stage);
    });
    this.domManipulator.markKnownKanji(kanji, srsStages);
    this.interval = setInterval(() => {
      const newNodesCount = this.domManipulator.getTextNodes().length;
      if (newNodesCount !== this.nodesCount) {
        this.nodesCount = newNodesCount;
        this.domManipulator.markKnownKanji(kanji, srsStages);
      }
    }, this.timeout);
  }

  stop() {
    console.log('Stoped!');
    this.domManipulator.editBodyAttribute('data-dsnm-on');
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private registerListeners() {
    chrome.runtime.onMessage.addListener((msg) => {
      console.log(msg);
      if (msg.command === 'start') {
        this.start();
      }
      if (msg.command === 'stop') {
        this.stop();
      }
    });
    this.port.onMessage.addListener((msg) => {
      console.log('Got messasge from SW');
      if (msg.command === 'data-ready') {
        this.knownKanji = msg.data;
        chrome.storage.sync.get('running', ({ running }) => {
          if (running) {
            this.start();
          }
        });
      }
    });
  }
}

console.log('Window loaded');
const runtime = new Runtime();
runtime.init();
