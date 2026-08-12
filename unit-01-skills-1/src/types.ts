export interface ReadingPassage {
  title: string;
  paragraphs: string[];
}

export interface UsefulQuestion {
  id: number;
  question: string;
  usefulLanguage: string[];
  pronunciationTip: string;
  depthPrompt: string;
  sampleAnswer?: string;
}

export interface VocabularyWord {
  word: string;
  phonetic: string;
  meaning: string;
  type: string;
  example: string;
}

export interface SpeechEvaluation {
  transcript: string;
  isGood: boolean;
  score: number; // 0 - 100
  feedback: string;
  matchedKeywords: string[];
  suggestions: string[];
}
