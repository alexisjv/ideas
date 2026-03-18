import { Router, Request, Response, NextFunction } from 'express';
import { IStorageService } from '../interfaces/IStorageService';
import { IAnthropicService } from '../interfaces/IAnthropicService';

export function createGenerateRouter(
  storage: IStorageService,
  anthropic: IAnthropicService
): Router {
  const router = Router({ mergeParams: true });

  // SSE streaming endpoint
  router.get('/stream', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.params;
      const session = storage.getSession(sessionId);

      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }

      if (session.ideas.length === 0) {
        res.status(400).json({ error: 'No ideas to generate from' });
        return;
      }

      await anthropic.streamGenerateVenture(session, res);

      // Save after streaming
      const updated = storage.getSession(sessionId);
      if (updated?.lastGenerated) {
        storage.saveGeneratedVenture(sessionId, updated.lastGenerated);
      }
    } catch (err) {
      next(err);
    }
  });

  // Non-streaming endpoint
  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.params;
      const session = storage.getSession(sessionId);

      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }

      if (session.ideas.length === 0) {
        res.status(400).json({ error: 'No ideas to generate from' });
        return;
      }

      const venture = await anthropic.generateVenture(session);
      storage.saveGeneratedVenture(sessionId, venture);
      res.json(venture);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
