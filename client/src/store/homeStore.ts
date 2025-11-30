import { create } from 'zustand';

type AuthMode = 'login' | 'signup';

interface HomeStore {
    authMode: AuthMode;
    setAuthMode: (mode: AuthMode) => void;
    switchToLogin: () => void;
    switchToSignup: () => void;
}

export const useHomeStore = create<HomeStore>((set) => ({
    authMode: 'login',
    setAuthMode: (mode) => set({ authMode: mode }),
    switchToLogin: () => set({ authMode: 'login' }),
    switchToSignup: () => set({ authMode: 'signup' }),
}));
