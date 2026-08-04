export interface SentenceItem {
  id: number;
  text: string;
  subject: string;
  be: string;
  adjective: string;
  preposition: string;
  gerundOrNoun: string;
  color: string;
  translation: string;
  icon: string;
}

export interface PrepositionStructure {
  id: string;
  adjective: string;
  preposition: string;
  meaning: string;
  exampleSentence: string;
  exampleHighlight: string;
  color: string;
}

export interface PracticeQuestion {
  id: number;
  type: 'preposition' | 'verb_form' | 'sentence_builder';
  questionPrompt: string;
  sentenceBefore: string;
  sentenceAfter: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface PronunciationWord {
  id: string;
  word: string;
  sound: 'short_u' | 'long_u';
  ipa: string;
  meaning: string;
}
