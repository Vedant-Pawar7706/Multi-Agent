import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  activeTab: 'planner' | 'discover' | 'budget' | 'agent-activity' | 'my-trips' | 'settings';
  isWizardOpen: boolean;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'register';

  toggleSidebar: () => void;
  setActiveTab: (tab: UIState['activeTab']) => void;
  openWizard: () => void;
  closeWizard: () => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

// Ensure permanent dark mode
if (typeof document !== 'undefined') {
  document.documentElement.classList.add('dark');
  try {
    localStorage.removeItem('voyageai_theme');
  } catch {}
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeTab: 'planner',
  isWizardOpen: false,
  isAuthModalOpen: false,
  authMode: 'login',

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  openWizard: () => set({ isWizardOpen: true }),
  closeWizard: () => set({ isWizardOpen: false }),
  openAuthModal: (mode = 'login') => set({ isAuthModalOpen: true, authMode: mode }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
}));
