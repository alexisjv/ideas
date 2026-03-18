import { Session, Participant, Idea, GeneratedVenture } from '../types';

export interface IStorageService {
  createSession(name: string): Session;
  getSession(sessionId: string): Session | undefined;
  getAllSessions(): Session[];
  deleteSession(sessionId: string): boolean;

  addParticipant(sessionId: string, participant: Omit<Participant, 'id' | 'joinedAt'>): Participant;
  removeParticipant(sessionId: string, participantId: string): boolean;

  addIdea(sessionId: string, idea: Omit<Idea, 'id' | 'createdAt' | 'reactions'>): Idea;
  updateIdeaReaction(sessionId: string, ideaId: string, emoji: string, participantId: string): Idea | undefined;

  saveGeneratedVenture(sessionId: string, venture: GeneratedVenture): void;
}
