import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chat';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(chatRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
