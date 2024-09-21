export class ApiStorage {
  private readonly cacheName: string = 'dai-san-no-me-storage';

  constructor() {}

  async getStoredValue(url: string) {
    try {
      const cache = await caches.open(this.cacheName);
      const match = await cache.match(url);
      if (match) {
        console.info(`Value from ${url} was found in storage`);
        const data = await match.json();
        return data;
      } else {
        return null;
        // console.log('fetched');
        // const response = await fetch(url);
        // const responseToCache = response.clone();

        // const cache = await caches.open(this.cacheName);
        // cache.put(url, responseToCache);

        // const data = await response.json();
        // return data;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async clear(url?: string) {
    try {
      if (url) {
        const cache = await caches.open(this.cacheName);
        cache.delete(url);
      } else {
        caches.delete(this.cacheName);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async storeValue(response: Response, url: string) {
    const responseToCache = response.clone();
    const cache = await caches.open(this.cacheName);
    cache.put(url, responseToCache);
  }
}
