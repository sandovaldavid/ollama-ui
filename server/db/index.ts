import mongoose from 'mongoose';

const MONGODB_URI =
    process.env.VITE_MONGO_URI || 'mongodb://localhost:27017/ollama-chat';

export async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI, {
            auth: {
                username: process.env.VITE_MONGO_USER,
                password: process.env.VITE_MONGO_PASSWORD,
            },
            authSource: 'admin',
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

// Define schemas
const ChatSchema = new mongoose.Schema({
    title: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const MessageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true,
    },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

// Create models
export const Chat = mongoose.model('Chat', ChatSchema);
export const Message = mongoose.model('Message', MessageSchema);
