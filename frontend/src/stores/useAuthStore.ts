import { create } from 'zustand';
import { User } from '../types';
import { api } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('voyageai_token'),
  isAuthenticated: !!localStorage.getItem('voyageai_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.login({ email, password });
      localStorage.setItem('voyageai_token', res.access_token);
      set({ user: res.user, token: res.access_token, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || 'Login failed', isLoading: false });
      throw err;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.register({ name, email, password });
      localStorage.setItem('voyageai_token', res.access_token);
      set({ user: res.user, token: res.access_token, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || 'Registration failed', isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('voyageai_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('voyageai_token');
    if (!token) return;
    try {
      const user = await api.getMe();
      set({ user, isAuthenticated: true });
    } catch {
      localStorage.removeItem('voyageai_token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  }
}));
