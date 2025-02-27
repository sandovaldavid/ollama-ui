import { Document } from 'mongoose';

export interface IChat extends Document {
    title: string;
    createdAt: Date;
}

export interface IMessage extends Document {
    chatId: IChat['_id'];
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}
