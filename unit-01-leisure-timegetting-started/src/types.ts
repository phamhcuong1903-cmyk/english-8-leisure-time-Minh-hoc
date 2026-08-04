export interface DialogueLine {
  speaker: 'Tom' | 'Trang' | string;
  text: string;
}

export type RoleSelection = 'all' | 'Trang' | 'Tom' | null;

export interface CharacterInfo {
  id: 'Trang' | 'Tom';
  name: string;
  image: string;
  color: string;
  bgColor: string;
  description: string;
  hobbies: string[];
}
