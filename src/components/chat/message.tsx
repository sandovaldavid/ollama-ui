import { Card } from '@/components/ui/card';
import { Bot, User } from 'lucide-react';
import type { Message as MessageType } from '@shared/schema';

interface MessageProps {
    message: MessageType;
}

export function Message({ message }: MessageProps) {
    const isAI = message.role === 'assistant';

    return (
        <Card className={`p-4 ${isAI ? 'bg-muted' : 'bg-primary/5'}`}>
            <div className="flex items-start gap-3">
                <div
                    className={`rounded-full p-2 ${isAI ? 'bg-primary' : 'bg-secondary'}`}
                >
                    {isAI ? (
                        <Bot className="h-5 w-5 text-primary-foreground" />
                    ) : (
                        <User className="h-5 w-5 text-secondary-foreground" />
                    )}
                </div>
                <div className="flex-1">
                    <div className="font-medium mb-1">
                        {isAI ? 'DeepSeek AI' : 'You'}
                    </div>
                    <div className="text-sm whitespace-pre-wrap">
                        {message.content}
                    </div>
                </div>
            </div>
        </Card>
    );
}
