import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.js';
import imageRoutes from './routes/images.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));


app.use('/api/health', healthRoutes);
app.use('/api/images', imageRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
