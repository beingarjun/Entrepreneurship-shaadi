import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import passport from '@/config/passport';

import authRoutes from '@/modules/auth/auth.controller';
import mcaRoutes from '@/modules/mca/mca.controller';
import profileRoutes from '@/modules/profile/profile.controller';
import personaRoutes from '@/modules/persona/persona.controller';
import matchRoutes from '@/modules/match/match.controller';

import { errorHandler } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/mca', mcaRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/persona', personaRoutes);
app.use('/api/match', matchRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📖 API Documentation: http://localhost:${PORT}/api-docs`);
});

export default app;