import { Router, Request, Response, NextFunction } from 'express';
import { IStorageService } from '../interfaces/IStorageService';

const PARTICIPANT_COLORS = [
  '#7c3aed', '#06b6d4', '#f59e0b', '#10b981',
  '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6',
];

const PARTICIPANT_EMOJIS = ['🚀', '💡', '🎯', '⚡', '🌟', '🔥', '💎', '🦋'];

export function createParticipantsRouter(storage: IStorageService): Router {
  const router = Router({ mergeParams: true });

  router.post('/', (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.params;
      const session = storage.getSession(sessionId);
      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }

      const { name } = req.body;
      if (!name || typeof name !== 'string') {
        res.status(400).json({ error: 'Participant name is required' });
        return;
      }

      const idx = session.participants.length % PARTICIPANT_COLORS.length;
      const participant = storage.addParticipant(sessionId, {
        name: name.trim(),
        emoji: PARTICIPANT_EMOJIS[idx],
        color: PARTICIPANT_COLORS[idx],
      });

      res.status(201).json(participant);
    } catch (err) {
      next(err);
    }
  });

  router.delete('/:participantId', (req: Request, res: Response) => {
    const { sessionId, participantId } = req.params;
    const removed = storage.removeParticipant(sessionId, participantId);
    if (!removed) {
      res.status(404).json({ error: 'Participant not found' });
      return;
    }
    res.status(204).send();
  });

  return router;
}
