import { Router, Request, Response, NextFunction } from 'express';
import { IStorageService } from '../interfaces/IStorageService';
import { IdeaCategory } from '../types';

const VALID_CATEGORIES: IdeaCategory[] = [
  'problem', 'solution', 'market', 'feature', 'model', 'wild'
];

export function createIdeasRouter(storage: IStorageService): Router {
  const router = Router({ mergeParams: true });

  router.post('/', (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.params;
      const session = storage.getSession(sessionId);
      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }

      const { participantId, content, category } = req.body;
      if (!participantId || !content || !category) {
        res.status(400).json({ error: 'participantId, content and category are required' });
        return;
      }

      if (!VALID_CATEGORIES.includes(category as IdeaCategory)) {
        res.status(400).json({ error: `category must be one of: ${VALID_CATEGORIES.join(', ')}` });
        return;
      }

      const participant = session.participants.find(p => p.id === participantId);
      if (!participant) {
        res.status(404).json({ error: 'Participant not found in this session' });
        return;
      }

      const idea = storage.addIdea(sessionId, {
        participantId,
        participantName: participant.name,
        content: content.trim(),
        category: category as IdeaCategory,
      });

      res.status(201).json(idea);
    } catch (err) {
      next(err);
    }
  });

  router.post('/:ideaId/reactions', (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId, ideaId } = req.params;
      const { emoji, participantId } = req.body;

      if (!emoji || !participantId) {
        res.status(400).json({ error: 'emoji and participantId are required' });
        return;
      }

      const idea = storage.updateIdeaReaction(sessionId, ideaId, emoji, participantId);
      if (!idea) {
        res.status(404).json({ error: 'Idea not found' });
        return;
      }

      res.json(idea);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
