import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@shared/schema';

const client = createClient({
    url: 'file:chat.db',
});

export const sqliteClient = client;

export const db = drizzle(client, {
    schema,
    logger: process.env.NODE_ENV === 'development',
});
