import { HttpClient } from './HttpClient.js';
import {
  INITIAL_ASSIGNMENTS_URL,
  INITIAL_KANJI_URL,
} from './../lib/constants.js';
import { Assignment, KnownKanji, Subject, WaniKaniResponse } from 'types.js';

export class Program {
  private httpClient: HttpClient;
  private subjects: WaniKaniResponse<Subject>[] = [];
  private assignments: WaniKaniResponse<Assignment>[] = [];
  private kanji: KnownKanji[] = [];

  constructor() {
    this.httpClient = new HttpClient();
    this.registerListeners();
  }

  /**
   * Available spaced repetition systems used for calculating `srs_stage` changes to Assignments and Reviews. Has
   * relationship with Subjects.
   *
   * @see {@link https://docs.api.wanikani.com/20170710/#spaced-repetition-systems}
   * @category Resources
   * @category Spaced Repetition Systems
   */
  async init() {
    this.subjects = await this.fetchSubjects();
    this.assignments = await this.fetchAssignments();
    this.kanji = this.assignments
      .map((assignment) => ({
        srs_stage: assignment.data.srs_stage,
        character: this.subjects.find(
          (subject) => subject.id === assignment.data.subject_id
        )?.data?.characters,
      }))
      .filter((knownKanji) => knownKanji.character?.length) as KnownKanji[];
    console.log(this.kanji);
  }

  private registerListeners() {
    chrome.runtime.onConnect.addListener((port) => {
      console.log(port.name);
      port.onMessage.addListener((msg) => {
        console.log(msg);
        if (msg.command === 'get-data' && this.kanji.length) {
          port.postMessage({ command: 'data-ready', data: this.kanji });
        }
      });
      // const interval = setInterval(() => {
      //   console.log('X');
      //   if (this.kanji.length) {
      //     console.log('send');
      //     port.postMessage({ command: 'data-ready', data: this.kanji });
      //     clearTimeout(interval);
      //   }
      // }, 100);
    });

    chrome.runtime.onMessage.addListener((request) => {
      console.log('recevied message');
      if (request.command === 'clear-storage') {
        console.log('clear');
        this.httpClient.clearStorage();
      }
      // to be aync
      return true;
    });
  }

  private async fetchSubjects(): Promise<WaniKaniResponse<Subject>[]> {
    return this.fetchWaniKaniResource(INITIAL_KANJI_URL);
  }

  private async fetchAssignments(): Promise<WaniKaniResponse<Assignment>[]> {
    return this.fetchWaniKaniResource(INITIAL_ASSIGNMENTS_URL);
  }

  private async fetchWaniKaniResource<T>(
    url: string
  ): Promise<WaniKaniResponse<T>[]> {
    let response = await this.httpClient.get(url);
    let collection: WaniKaniResponse<T>[] = response.data;
    while (response.pages.next_url) {
      response = await this.httpClient.get(response.pages.next_url);
      collection = [...collection, ...response.data];
    }
    return collection;
  }
}
