export interface TranscriptLine {
  speaker: string;
  text: string;
}

export interface Track {
  id: string;
  title: string;
  audioFile: string;
  transcript: TranscriptLine[];
}

export type ListeningRound = 1 | 2;

export interface TrackState {
  currentRound: ListeningRound;
  hasVisitedRound2: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  activeLineIndex: number | null;
}
