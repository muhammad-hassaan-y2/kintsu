import { Router } from 'express';
import authRoutes from './auth.routes.js';
import sessionsRoutes from './sessions.routes.js';
import storiesRoutes from './stories.routes.js';
import booksRoutes from './books.routes.js';
import videosRoutes from './videos.routes.js';
import participantsRoutes from './participants.routes.js';
import discussionsRoutes from './discussions.routes.js';
import resourcesRoutes from './resources.routes.js';
import analyticsRoutes from './analytics.routes.js';
import aiRoutes from './ai.routes.js';
import sessionBuilderRoutes from './sessionBuilder.routes.js';
import roleplayRoutes from './roleplay.routes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/sessions', sessionsRoutes);
apiRouter.use('/stories', storiesRoutes);
apiRouter.use('/books', booksRoutes);
apiRouter.use('/videos', videosRoutes);
apiRouter.use('/participants', participantsRoutes);
apiRouter.use('/discussions', discussionsRoutes);
apiRouter.use('/resources', resourcesRoutes);
apiRouter.use('/analytics', analyticsRoutes);
apiRouter.use('/ai', aiRoutes);
apiRouter.use('/session-builder', sessionBuilderRoutes);
apiRouter.use('/roleplay', roleplayRoutes);

export default apiRouter;
