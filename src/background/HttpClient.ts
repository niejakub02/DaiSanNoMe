import { ApiStorage } from './ApiStorage.js';

export class HttpClient {
  private httpHeaders: Headers;
  private storage: ApiStorage;

  constructor() {
    this.httpHeaders = new Headers();
    this.storage = new ApiStorage();
    this.init();
  }

  init() {
    chrome.storage.sync.get(null, (data) => {
      console.log(data);
      if (data.token) {
        this.httpHeaders.append('Authorization', `Bearer ${data.token}`);
        chrome.storage.sync.set({ warning: '' });
      } else {
        chrome.storage.sync.set({
          warning:
            'To make the extension work, please insert your WaniKani token in the extension settings first!',
        });
      }
    });
  }

  async get(url: string) {
    try {
      const value = await this.storage.getStoredValue(url);
      if (value) {
        return value;
      } else {
        console.info(`Value from ${url} has been fetched`);
        const response = await fetch(url, {
          headers: this.httpHeaders,
        });
        this.storage.storeValue(response, url);
        const data = await response.json();
        return data;
      }
    } catch (err) {
      console.error(err);
    }
  }

  clearStorage(url?: string) {
    this.storage.clear(url);
  }

  clearHeaders() {
    this.httpHeaders.delete('Authorization');
  }
}
