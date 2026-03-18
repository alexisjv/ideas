import { v4 as uuidv4 } from 'uuid';
import { Session, Participant, Idea, GeneratedVenture } from '../types';
import { IStorageService } from '../interfaces/IStorageService';

export class InMemoryStorageService implements IStorageService {
  private sessions: Map<string, Session> = new Map();

  createSession(name: string): Session {
    const session: Session = {
      id: uuidv4(),
      name,
      participants: [],
      ideas: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.sessions.set(session.id, session);
    return session;
  }

  getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId);
  }

  getAllSessions(): Session[] {
    return Array.from(this.sessions.values());
  }

  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  addParticipant(sessionId: string, data: Omit<Participant, 'id' | 'joinedAt'>): Participant {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    const participant: Participant = {
      id: uuidv4(),
      joinedAt: new Date().toISOString(),
      ...data,
    };
    session.participants.push(participant);
    session.updatedAt = new Date().toISOString();
    return participant;
  }

  removeParticipant(sessionId: string, participantId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const index = session.participants.findIndex(p => p.id === participantId);
    if (index === -1) return false;

    session.participants.splice(index, 1);
    session.updatedAt = new Date().toISOString();
    return true;
  }

  addIdea(sessionId: string, data: Omit<Idea, 'id' | 'createdAt' | 'reactions'>): Idea {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    const idea: Idea = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      reactions: {},
      ...data,
    };
    session.ideas.push(idea);
    session.updatedAt = new Date().toISOString();
    return idea;
  }

  updateIdeaReaction(sessionId: string, ideaId: string, emoji: string, participantId: string): Idea | undefined {
    const session = this.sessions.get(sessionId);
    if (!session) return undefined;

    const idea = session.ideas.find(i => i.id === ideaId);
    if (!idea) return undefined;

    if (!idea.reactions[emoji]) idea.reactions[emoji] = [];
    const idx = idea.reactions[emoji].indexOf(participantId);
    if (idx === -1) {
      idea.reactions[emoji].push(participantId);
    } else {
      idea.reactions[emoji].splice(idx, 1);
    }

    session.updatedAt = new Date().toISOString();
    return idea;
  }

  saveGeneratedVenture(sessionId: string, venture: GeneratedVenture): void {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);
    session.lastGenerated = venture;
    session.updatedAt = new Date().toISOString();
  }
}
