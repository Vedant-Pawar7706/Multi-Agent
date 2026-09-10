/// <reference types="vite/client" />
import axios from 'axios';
import { Trip, TravelGuide, User } from '../types';

// Support build-time VITE_API_URL and runtime override from Settings
export const getApiBase = (): string => {
  if (typeof window !== 'undefined') {
    const savedUrl = localStorage.getItem('mytrip_api_url');
    if (savedUrl && savedUrl.trim()) {
      const trimmed = savedUrl.trim().replace(/\/+$/, '');
      return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
    }
  }

  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    const trimmed = envUrl.trim().replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }

  return '/api';
};

export const API_BASE = getApiBase();

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 60000, // 60s to gracefully accommodate Render cold starts
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  // Update baseURL dynamically in case user configured it in Settings
  config.baseURL = getApiBase();
  const token = localStorage.getItem('mytrip_token') || localStorage.getItem('voyageai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Auth
  register: async (data: any) => (await apiClient.post('/auth/register', data)).data,
  login: async (data: any) => (await apiClient.post('/auth/login', data)).data,
  getMe: async () => (await apiClient.get('/auth/me')).data,

  // Trips
  createTrip: async (tripData: Partial<Trip>) => (await apiClient.post<Trip>('/trips', tripData)).data,
  getTrips: async () => (await apiClient.get<Trip[]>('/trips')).data,
  getTrip: async (id: string) => (await apiClient.get<Trip>(`/trips/${id}`)).data,
  updateTrip: async (id: string, data: Partial<Trip>) => (await apiClient.put<Trip>(`/trips/${id}`, data)).data,
  deleteTrip: async (id: string) => (await apiClient.delete(`/trips/${id}`)).data,
  toggleShare: async (id: string) => (await apiClient.post(`/trips/${id}/share`)).data,
  getSharedTrip: async (code: string) => (await apiClient.get(`/trips/share/${code}`)).data,

  // Planning & Agents
  startPlanning: async (tripId: string) => (await apiClient.post(`/trips/${tripId}/plan`)).data,
  getItinerary: async (tripId: string) => (await apiClient.get<TravelGuide>(`/trips/${tripId}/itinerary`)).data,
  getAgentStatus: async (tripId: string) => (await apiClient.get(`/trips/${tripId}/agents`)).data,
  sendAICommand: async (tripId: string, command: string) => (await apiClient.post(`/trips/${tripId}/command`, { command })).data,

  // Export
  getPDFUrl: (tripId: string) => `${API_BASE}/trips/${tripId}/export/pdf`,

  // Demo
  getDemoTokyo: async () => (await apiClient.get('/demo/tokyo')).data,
};
