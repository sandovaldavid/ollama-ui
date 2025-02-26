import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const chats = sqliteTable('chats', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const messages = sqliteTable('messages', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    chatId: integer('chat_id').references(() => chats.id),
    role: text('role').notNull(),
    content: text('content').notNull(),
    timestamp: text('timestamp').default(sql`CURRENT_TIMESTAMP`),
});
