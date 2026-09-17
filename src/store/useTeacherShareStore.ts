import { create } from 'zustand';

interface TeacherShareState {
  taskId: string | null;
  status: string;
  selectTask: (taskId: string | null) => void;
  setStatus: (status: string) => void;
  reset: () => void;
}

export const useTeacherShareStore = create<TeacherShareState>(set => ({
  taskId: null,
  status: '',
  selectTask: taskId => set({ taskId, status: '' }),
  setStatus: status => set({ status }),
  reset: () => set({ taskId: null, status: '' })
}));
