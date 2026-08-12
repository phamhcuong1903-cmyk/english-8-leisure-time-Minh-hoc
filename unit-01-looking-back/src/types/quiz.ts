export interface StandardQuestion {
  id?: string;
  prompt?: string;
  cue?: string;
  verbHint?: string;
  acceptedAnswers: string[];
  explanation: string;
  tip?: string;
}

export interface BlankItem {
  number: number;
  verbHint: string;
  acceptedAnswers: string[];
  explanation: string;
}

export interface PassageQuestions {
  passageTemplate: string;
  blanks: BlankItem[];
}

export interface Section {
  sectionTitle: string;
  instruction: string;
  type: 'fill-blank' | 'sentence-building' | 'verb-form' | 'passage';
  questions: StandardQuestion[] | PassageQuestions;
}

export interface QuizData {
  sections: Section[];
}

// User state tracking interfaces
export type UserAnswers = Record<string, string>; // e.g. "s1_q0": "doing puzzles", "s4_b2": "reading"

export interface QuestionGrading {
  isCorrect: boolean;
  userAnswer: string;
  acceptedAnswers: string[];
  explanation: string;
  tip?: string;
}

export interface SectionGrading {
  sectionIndex: number;
  graded: boolean;
  score: number;
  totalQuestions: number;
  details: Record<string, QuestionGrading>;
}
