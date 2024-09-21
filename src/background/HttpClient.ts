import { ApiStorage } from './ApiStorage.js';
import { TOKEN } from './../lib/constants.js';

export class HttpClient {
  private httpHeaders: Headers;
  private storage: ApiStorage;

  constructor() {
    this.httpHeaders = new Headers();
    this.storage = new ApiStorage();
    this.init();
  }

  private init() {
    this.httpHeaders.append('Authorization', `Bearer ${TOKEN}`);
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
}
