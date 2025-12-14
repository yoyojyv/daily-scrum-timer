export interface Member {
  id: string;
  name: string;
  isOnVacation: boolean;
  isCompleted: boolean;
}

export type MeetingStatus = 'idle' | 'running' | 'paused' | 'completed';

export type Theme = 'light' | 'dark';
