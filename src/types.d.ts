export type ObjectType =
  | 'collection'
  | 'report'
  | 'assignment'
  | 'kana_vocabulary'
  | 'kanji'
  | 'level_progression'
  | 'radical'
  | 'reset'
  | 'review_statistic'
  | 'review'
  | 'spaced_repetition_system'
  | 'study_material'
  | 'user'
  | 'vocabulary'
  | 'voice_actor';

export type SubjectType =
  | 'kana_vocabulary'
  | 'kanji'
  | 'radical'
  | 'vocabulary';

export type WaniKaniResponse<T> = {
  id: number;
  object: ObjectType;
  url: string;
  data_updated_at: Date;
  data: T;
};

export type Subject = {
  amalgamation_subject_ids: number[];
  auxiliary_meanings: AuxiliaryMeaning[];
  characters: string;
  character_images: CharacterImage[];
  created_at: Date;
  document_url: string;
  hidden_at: null;
  lesson_position: number;
  level: number;
  meanings: Meaning[];
  meaning_mnemonic: string;
  slug: string;
  spaced_repetition_system_id: number;
};

export type Assignment = {
  created_at: Date;
  subject_id: number;
  subject_type: SubjectType;
  srs_stage: number;
  unlocked_at: Date | null;
  started_at: Date | null;
  passed_at: Date | null;
  burned_at: Date | null;
  available_at: Date | null;
  resurrected_at: Date | null;
  hidden: boolean;
};

export type AuxiliaryMeaning = {
  meaning: string;
  /**
   * Either whitelist or blacklist. When evaluating user input, whitelisted meanings are used to match for correctness. Blacklisted meanings are used to match for incorrectness.
   */
  type: 'whitelist' | 'blacklist';
};

export type CharacterImage = {
  url: string;
  metadata: Record<string, unknown>;
  /**
   * The content type of the image. The API only delivers image/svg+xml.
   */
  content_type: 'image/svg+xml';
};

export type Meaning = {
  meaning: string;
  primary: boolean;
  accepted_answer: boolean;
};

export type KnownKanji = {
  character: string;
  srs_stage: number;
};
