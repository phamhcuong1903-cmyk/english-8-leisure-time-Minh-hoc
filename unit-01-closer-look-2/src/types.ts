export interface ClassifyColumn {
  id: string;
  label: string;
}

export interface ClassifyItem {
  word: string;
  correctColumn: string;
}

export interface ClassifyData {
  instruction: string;
  columns: ClassifyColumn[];
  items: ClassifyItem[];
  explanation: string;
}

export interface SentenceQuestion {
  prompt: string;
  hint: string;
  acceptedAnswers: string[];
  explanation: string;
}

export interface SentencePracticeData {
  formula: string;
  questions: SentenceQuestion[];
}

export interface MultipleChoiceQuestion {
  question: string;
  options: Record<string, string>;
  correctAnswer: string;
  explanation: string;
}

export interface MultipleChoiceData {
  questions: MultipleChoiceQuestion[];
}
