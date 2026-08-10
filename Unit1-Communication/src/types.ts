export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  hasEnded: boolean;
  audioSourceType: 'file' | 'speech' | 'none';
}

export interface SubmissionData {
  text: string;
  wordCount: number;
  charCount: number;
  submittedAt: Date;
  timeSpentSeconds: number;
}
