import { create } from 'zustand';

interface UIState {
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  activeTab: 'planner' | 'discover' | 'budget' | 'agent-activity' | 'my-trips' | 'settings';
  isWizardOpen: boolean;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'register';

  toggleTheme: () => void;
  toggleSidebar: () => void;
  setActiveTab: (tab: UIState['activeTab']) => void;
  openWizard: () => void;
  closeWizard: () => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'dark',
  sidebarOpen: true,
  activeTab: 'planner',
  isWizardOpen: false,
  isAuthModalOpen: false,
  authMode: 'login',

  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: nextTheme };
  }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  openWizard: () => set({ isWizardOpen: true }),
  closeWizard: () => set({ isWizardOpen: false }),
  openAuthModal: (mode = 'login') => set({ isAuthModalOpen: true, authMode: mode }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
}));
