import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Session,
  Participant,
  Idea,
  IdeaCategory,
  GeneratedVenture,
  AppSettings,
} from '../types';
import { v4 as uuidv4 } from '../utils/uuid';

const PARTICIPANT_COLORS = [
  '#7c3aed', '#06b6d4', '#f59e0b', '#10b981',
  '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6',
];
const PARTICIPANT_EMOJIS = ['🚀', '💡', '🎯', '⚡', '🌟', '🔥', '💎', '🦋'];

interface AppState {
  session: Session | null;
  currentParticipant: Participant | null;
  isGenerating: boolean;
  generationProgress: string;
  streamingText: string;
  settings: AppSettings;

  // Session actions
  createSession: (name: string) => Session;
  loadSession: (session: Session) => void;
  clearSession: () => void;

  // Participant actions
  joinSession: (name: string) => Participant;
  setCurrentParticipant: (participant: Participant | null) => void;

  // Idea actions
  addIdea: (content: string, category: IdeaCategory) => Idea;
  toggleReaction: (ideaId: string, emoji: string) => void;

  // AI generation
  setGenerating: (value: boolean) => void;
  setGenerationProgress: (msg: string) => void;
  appendStreamingText: (text: string) => void;
  clearStreamingText: () => void;
  saveGenerated: (venture: GeneratedVenture) => void;

  // Settings
  updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      session: null,
      currentParticipant: null,
      isGenerating: false,
      generationProgress: '',
      streamingText: '',
      settings: {
        apiKey: '',
        backendUrl: 'http://localhost:3001',
        mode: 'direct',
      },

      createSession: (name: string) => {
        const session: Session = {
          id: uuidv4(),
          name,
          participants: [],
          ideas: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set({ session });
        return session;
      },

      loadSession: (session: Session) => {
        set({ session, currentParticipant: null });
      },

      clearSession: () => {
        set({ session: null, currentParticipant: null });
      },

      joinSession: (name: string) => {
        const { session } = get();
        if (!session) throw new Error('No active session');

        const idx = session.participants.length % PARTICIPANT_COLORS.length;
        const participant: Participant = {
          id: uuidv4(),
          name: name.trim(),
          emoji: PARTICIPANT_EMOJIS[idx],
          color: PARTICIPANT_COLORS[idx],
          joinedAt: new Date().toISOString(),
        };

        const updatedSession: Session = {
          ...session,
          participants: [...session.participants, participant],
          updatedAt: new Date().toISOString(),
        };

        set({ session: updatedSession, currentParticipant: participant });
        return participant;
      },

      setCurrentParticipant: (participant: Participant | null) => {
        set({ currentParticipant: participant });
      },

      addIdea: (content: string, category: IdeaCategory) => {
        const { session, currentParticipant } = get();
        if (!session || !currentParticipant) throw new Error('No active session or participant');

        const idea: Idea = {
          id: uuidv4(),
          participantId: currentParticipant.id,
          participantName: currentParticipant.name,
          content: content.trim(),
          category,
          reactions: {},
          createdAt: new Date().toISOString(),
        };

        const updatedSession: Session = {
          ...session,
          ideas: [...session.ideas, idea],
          updatedAt: new Date().toISOString(),
        };

        set({ session: updatedSession });
        return idea;
      },

      toggleReaction: (ideaId: string, emoji: string) => {
        const { session, currentParticipant } = get();
        if (!session || !currentParticipant) return;

        const updatedIdeas = session.ideas.map((idea) => {
          if (idea.id !== ideaId) return idea;
          const reactions = { ...idea.reactions };
          if (!reactions[emoji]) reactions[emoji] = [];
          const idx = reactions[emoji].indexOf(currentParticipant.id);
          if (idx === -1) {
            reactions[emoji] = [...reactions[emoji], currentParticipant.id];
          } else {
            reactions[emoji] = reactions[emoji].filter(id => id !== currentParticipant.id);
          }
          return { ...idea, reactions };
        });

        set({
          session: {
            ...session,
            ideas: updatedIdeas,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      setGenerating: (value: boolean) => set({ isGenerating: value }),
      setGenerationProgress: (msg: string) => set({ generationProgress: msg }),
      appendStreamingText: (text: string) =>
        set((s) => ({ streamingText: s.streamingText + text })),
      clearStreamingText: () => set({ streamingText: '' }),

      saveGenerated: (venture: GeneratedVenture) => {
        const { session } = get();
        if (!session) return;
        set({
          session: {
            ...session,
            lastGenerated: venture,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      updateSettings: (settings: Partial<AppSettings>) => {
        set((s) => ({ settings: { ...s.settings, ...settings } }));
      },
    }),
    {
      name: 'ideaforge-storage',
      partialize: (state) => ({
        session: state.session,
        currentParticipant: state.currentParticipant,
        settings: state.settings,
      }),
    }
  )
);
