import express from 'express';
import { eq } from 'drizzle-orm';
import { chats, messages } from '@shared/schema';
import { db } from '../db/index';

const router = express.Router();

// Crear nuevo chat
router.post('/api/chats', async (req, res) => {
    const result = await db
        .insert(chats)
        .values({
            title: req.body.title || 'Nuevo Chat',
        })
        .returning();
    res.json(result[0]);
});

// Guardar mensajes
router.post('/api/chats/:chatId/messages', async (req, res) => {
    const { chatId } = req.params;
    const newMessages = req.body.messages;

    const result = await db.transaction(async (tx) => {
        const savedMessages = [];
        for (const msg of newMessages) {
            const [saved] = await tx
                .insert(messages)
                .values({
                    chatId: parseInt(chatId),
                    role: msg.role as 'user' | 'assistant',
                    content: msg.content,
                })
                .returning();
            savedMessages.push(saved);
        }
        return savedMessages;
    });

    res.json(result);
});

// Obtener mensajes de un chat
router.get('/api/chats/:chatId/messages', async (req, res) => {
    const { chatId } = req.params;
    const result = await db
        .select()
        .from(messages)
        .where(eq(messages.chatId, parseInt(chatId)))
        .orderBy(messages.timestamp);
    res.json(result);
});

export default router;
