import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { InMemoryStorageService } from './services/storage.service';
import { AnthropicService } from './services/anthropic.service';
import { createSessionsRouter } from './routes/sessions.route';
import { createParticipantsRouter } from './routes/participants.route';
import { createIdeasRouter } from './routes/ideas.route';
import { createGenerateRouter } from './routes/generate.route';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();
const PORT = process.env.PORT || 3001;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

if (!ANTHROPIC_API_KEY) {
  console.warn('[Warning] ANTHROPIC_API_KEY not set. AI features will not work.');
}

// Services (Dependency Injection)
const storage = new InMemoryStorageService();
const anthropic = new AnthropicService(ANTHROPIC_API_KEY);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/sessions', createSessionsRouter(storage));
app.use('/api/sessions/:sessionId/participants', createParticipantsRouter(storage));
app.use('/api/sessions/:sessionId/ideas', createIdeasRouter(storage));
app.use('/api/sessions/:sessionId/generate', createGenerateRouter(storage, anthropic));

// Error handling
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 IdeaForge backend running on http://localhost:${PORT}`);
});
