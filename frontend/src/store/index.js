import { create } from 'zustand';

export const useAppStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    themeMode: 'light', // 'light' or 'dark'
    login: (user) => set({ user, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),
    toggleTheme: () => set((state) => ({ themeMode: state.themeMode === 'light' ? 'dark' : 'light' })),
}));
