import express from 'express';
import cors from 'cors';
import { connectDB } from './db';
import chatRoutes from './routes/chat';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

connectDB()
    .then(() => {
        app.use(cors());
        app.use(express.json());
        app.use(chatRoutes);

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });
