import { Router, Request, Response, NextFunction } from 'express';
import { IStorageService } from '../interfaces/IStorageService';

export function createSessionsRouter(storage: IStorageService): Router {
  const router = Router();

  router.post('/', (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
      if (!name || typeof name !== 'string') {
        res.status(400).json({ error: 'Session name is required' });
        return;
      }
      const session = storage.createSession(name.trim());
      res.status(201).json(session);
    } catch (err) {
      next(err);
    }
  });

  router.get('/', (_req: Request, res: Response) => {
    res.json(storage.getAllSessions());
  });

  router.get('/:sessionId', (req: Request, res: Response) => {
    const session = storage.getSession(req.params.sessionId);
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    res.json(session);
  });

  router.delete('/:sessionId', (req: Request, res: Response) => {
    const deleted = storage.deleteSession(req.params.sessionId);
    if (!deleted) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    res.status(204).send();
  });

  return router;
}
