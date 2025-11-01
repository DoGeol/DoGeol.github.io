import { create } from 'zustand';

interface HeaderStore {
  isVisible: boolean;
  showHeader: () => void;
  hideHeader: () => void;
}

export const useHeaderStore = create<HeaderStore>((set) => ({
  isVisible: true,
  showHeader: () => set({ isVisible: true }),
  hideHeader: () => set({ isVisible: false }),
}));
