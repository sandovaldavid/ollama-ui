import express from 'express';
import chatRoutes from './routes/chat';

const app = express();
app.use(express.json());
app.use(chatRoutes);

export default app;
