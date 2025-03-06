import mongoose from 'mongoose';
import express from 'express';
import { Chat, Message } from '../db';

const router = express.Router();

router.get('/api/chats', async (_req, res) => {
    const chats = await Chat.find().sort({ createdAt: -1 });
    res.json(chats);
});

router.post('/api/chats', async (req, res) => {
    try {
        const chat = new Chat({
            title: req.body.title || 'Nuevo Chat',
            createdAt: new Date(),
        });
        const savedChat = await chat.save();
        res.json(savedChat);
    } catch (error) {
        console.error('Error creating chat:', error);
        res.status(500).json({ error: 'Error creating chat' });
    }
});

router.patch('/api/chats/:chatId', async (req, res) => {
    const { chatId } = req.params;
    const { title } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(chatId)) {
            return res.status(400).json({ error: 'Invalid chat ID format' });
        }

        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'Title is required' });
        }

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { title: title.trim(), updatedAt: new Date() },
            { new: true }
        );

        if (!updatedChat) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        res.json(updatedChat);
    } catch (error) {
        console.error('Error updating chat:', error);
        res.status(500).json({ error: 'Error updating chat' });
    }
});

router.delete('/api/chats/:chatId', async (req, res) => {
    const { chatId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(chatId)) {
            return res.status(400).json({ error: 'Invalid chat ID format' });
        }

        const deletedChat = await Chat.findByIdAndDelete(chatId);

        if (!deletedChat) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        await Message.deleteMany({
            chatId: new mongoose.Types.ObjectId(chatId),
        });

        res.json({
            message: 'Chat and associated messages deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting chat:', error);
        res.status(500).json({ error: 'Error deleting chat' });
    }
});

router.post('/api/chats/:chatId/messages', async (req, res) => {
    const { chatId } = req.params;
    const newMessages = req.body.messages;

    try {
        const savedMessages = await Promise.all(
            newMessages.map((msg: { role: string; content: string }) =>
                new Message({
                    chatId: new mongoose.Types.ObjectId(chatId),
                    role: msg.role,
                    content: msg.content,
                    timestamp: new Date(),
                }).save()
            )
        );
        res.json(savedMessages);
    } catch (error) {
        console.error('Error saving messages:', error);
        res.status(500).json({ error: 'Error saving messages' });
    }
});

router.get('/api/chats/:chatId/messages', async (req, res) => {
    const { chatId } = req.params;
    try {
        // Add validation for ObjectId format
        if (!mongoose.Types.ObjectId.isValid(chatId)) {
            return res.status(400).json({ error: 'Invalid chat ID format' });
        }

        const messages = await Message.find({
            chatId: new mongoose.Types.ObjectId(chatId),
        }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        console.error('Error getting messages:', error);
        res.status(500).json({ error: 'Error getting messages' });
    }
});

export default router;
