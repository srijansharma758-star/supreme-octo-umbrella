
import { AppState } from '../types';

const STORAGE_KEY = 'uniflow_app_data_v4';

const DEFAULT_STATE: AppState = {
  user: null,
  subjects: [
    {
      id: '1',
      name: 'Computer Networks',
      color: '#3B82F6',
      logs: [],
      syllabus: [
        { id: 's1', title: 'OSI Model', isCompleted: false },
      ]
    }
  ],
  holidays: [],
  routine: [],
  targetPercentage: 75
};

export const loadData = (): AppState => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : DEFAULT_STATE;
};

export const saveData = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const clearData = () => {
  localStorage.removeItem(STORAGE_KEY);
};
