export type TabType = 'flashcard' | 'quiz' | 'fill' | 'match' | 'bingo' | 'report';

export interface AppState {
  score: number;
  soundEnabled: boolean;
  selectedSection: string;
  selectedWordIndex: number; // 0-indexed position within filtered list
  masteredIds: Set<number>;
  reviewIds: Set<number>;
  correctCount: number;
  wrongCount: number;
  wordWrongStats: Record<number, number>; // word id -> count of wrong answers
}
