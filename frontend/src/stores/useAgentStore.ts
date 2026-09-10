import { create } from 'zustand';
import { AgentStatus } from '../types';
import { api } from '../services/api';

interface LogMessage {
  id: string;
  agent: string;
  message: string;
  timestamp: string;
}

interface AgentState {
  agents: Record<string, AgentStatus>;
  isPlanning: boolean;
  logs: LogMessage[];
  currentAgent: string | null;
  ws: WebSocket | null;
  pollInterval: any;

  initAgents: () => void;
  updateAgentStatus: (agentName: string, status: Partial<AgentStatus>) => void;
  addLog: (agent: string, message: string) => void;
  connectWebSocket: (tripId: string, onComplete: () => void) => void;
  disconnectWebSocket: () => void;
  startPollingFallback: (tripId: string, onComplete: () => void) => void;
}

const DEFAULT_AGENTS: Record<string, AgentStatus> = {
  research: { agent_name: 'research', status: 'waiting', execution_time: 0 },
  activity: { agent_name: 'activity', status: 'waiting', execution_time: 0 },
  budget: { agent_name: 'budget', status: 'waiting', execution_time: 0 },
  final: { agent_name: 'final', status: 'waiting', execution_time: 0 }
};

export const useAgentStore = create<AgentState>((set, get) => ({
  agents: { ...DEFAULT_AGENTS },
  isPlanning: false,
  logs: [],
  currentAgent: null,
  ws: null,
  pollInterval: null,

  initAgents: () => {
    set({
      agents: {
        research: { agent_name: 'research', status: 'waiting', execution_time: 0 },
        activity: { agent_name: 'activity', status: 'waiting', execution_time: 0 },
        budget: { agent_name: 'budget', status: 'waiting', execution_time: 0 },
        final: { agent_name: 'final', status: 'waiting', execution_time: 0 }
      },
      isPlanning: true,
      logs: [],
      currentAgent: 'research'
    });
  },

  updateAgentStatus: (agentName, data) => {
    set((state) => ({
      agents: {
        ...state.agents,
        [agentName]: {
          ...(state.agents[agentName] || { agent_name: agentName, status: 'waiting', execution_time: 0 }),
          ...data
        }
      }
    }));
  },

  addLog: (agent, message) => {
    const entry: LogMessage = {
      id: Math.random().toString(36).substring(7),
      agent,
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    set((state) => ({ logs: [entry, ...state.logs] }));
  },

  startPollingFallback: (tripId: string, onComplete: () => void) => {
    if (get().pollInterval) clearInterval(get().pollInterval);

    const interval = setInterval(async () => {
      try {
        const statuses: AgentStatus[] = await api.getAgentStatus(tripId);
        let allCompleted = true;
        let runningAgent = null;

        statuses.forEach((s) => {
          if (s.agent_name) {
            get().updateAgentStatus(s.agent_name, {
              status: s.status,
              execution_time: s.execution_time,
              output_summary: s.output_summary
            });
            if (s.status === 'running') {
              runningAgent = s.agent_name;
              allCompleted = false;
            } else if (s.status !== 'completed') {
              allCompleted = false;
            }
          }
        });

        if (runningAgent) {
          set({ currentAgent: runningAgent });
        }

        // Check if trip is completed in DB
        const trip = await api.getTrip(tripId);
        if (trip.status === 'completed' || (statuses.length >= 4 && allCompleted)) {
          clearInterval(interval);
          set({ isPlanning: false, currentAgent: null, pollInterval: null });
          get().addLog('orchestrator', 'Multi-Agent pipeline completed successfully!');
          onComplete();
        }
      } catch {
        // Continue polling
      }
    }, 1500);

    set({ pollInterval: interval });
  },

  connectWebSocket: (tripId: string, onComplete: () => void) => {
    get().disconnectWebSocket();

    const apiBase = import.meta.env.VITE_API_URL || '';
    let wsUrl: string;
    if (apiBase.startsWith('http://') || apiBase.startsWith('https://')) {
      const url = new URL(apiBase, window.location.origin);
      const wsProtocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
      const cleanPath = url.pathname.replace(/\/+$/, '');
      wsUrl = `${wsProtocol}//${url.host}${cleanPath}/trips/${tripId}/ws`;
    } else {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      wsUrl = `${protocol}//${window.location.host}/api/trips/${tripId}/ws`;
    }
    
    // Always start polling fallback as resilient backup
    get().startPollingFallback(tripId, onComplete);

    try {
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        get().addLog('orchestrator', 'WebSocket stream connected to MyTrip agent pipeline.');
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const { event: evt, agent, status, message, execution_time } = data;

          if (agent && agent !== 'orchestrator') {
            get().updateAgentStatus(agent, {
              status: status || 'running',
              execution_time: execution_time || 0,
              output_summary: message
            });
            set({ currentAgent: agent });
          }

          if (message) {
            get().addLog(agent || 'orchestrator', message);
          }

          if (evt === 'planning_completed') {
            if (get().pollInterval) clearInterval(get().pollInterval);
            set({ isPlanning: false, currentAgent: null });
            onComplete();
          }
        } catch {
          // Ignore JSON parse errors
        }
      };

      socket.onerror = () => {
        get().addLog('orchestrator', 'WebSocket stream active with HTTP status polling backup.');
      };

      set({ ws: socket });
    } catch {
      // WS failover
    }
  },

  disconnectWebSocket: () => {
    const { ws, pollInterval } = get();
    if (ws) {
      ws.close();
    }
    if (pollInterval) {
      clearInterval(pollInterval);
    }
    set({ ws: null, pollInterval: null });
  }
}));
