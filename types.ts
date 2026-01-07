
export type AttendanceStatus = 'P' | 'A' | 'H';

export interface AttendanceRecord {
  id: string;
  date: string;
  status: AttendanceStatus;
}

export interface SyllabusItem {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Subject {
  id: string;
  name: string;
  logs: AttendanceRecord[];
  syllabus: SyllabusItem[];
  color: string;
}

export interface Holiday {
  id: string;
  date: string;
  name: string;
}

export interface RoutineEntry {
  id: string;
  subjectId: string;
  day: string;
  startTime: string;
  endTime: string;
  room?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  university?: string;
}

export interface AppState {
  user: UserProfile | null;
  subjects: Subject[];
  holidays: Holiday[];
  routine: RoutineEntry[];
  targetPercentage: number;
}

export type TabType = 'dashboard' | 'attendance' | 'routine' | 'subjects' | 'holidays';
