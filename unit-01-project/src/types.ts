export interface MindMapBranch {
  id: string;
  label: string;
  color: string;
  subItems: string[];
}

export interface MindMapData {
  centralTopic: string;
  branches: MindMapBranch[];
}

export interface AssessmentItem {
  id: string;
  skill: string;
}

export interface SelfAssessmentData {
  title: string;
  levels: string[];
  items: AssessmentItem[];
}

export type ActiveTab = 'mindmap' | 'assessment';
