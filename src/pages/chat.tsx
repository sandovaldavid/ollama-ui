import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Message } from '@/components/chat/message';
import { MessageInput } from '@/components/chat/message-input';
import { apiRequest } from '@/lib/queryClient';
import type { Message as MessageType } from '@shared/schema';

export default function Chat() {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const { toast } = useToast();

    const chatMutation = useMutation({
        mutationFn: async (data: { prompt: string; files?: FileList }) => {
            let formData = new FormData();
            formData.append('prompt', data.prompt);

            if (data.files) {
                Array.from(data.files).forEach((file, index) => {
                    formData.append(`file${index}`, file);
                });
            }

            let endpoint = '/api/chat';
            if (data.prompt.startsWith('/code')) {
                endpoint = '/api/chat/code';
            } else if (data.prompt.startsWith('/image')) {
                endpoint = '/api/chat/image';
            } else if (data.prompt.startsWith('/paraphrase')) {
                endpoint = '/api/chat/paraphrase';
            }

            const res = await apiRequest(
                'POST',
                endpoint,
                data.files ? formData : { prompt: data.prompt }
            );
            return res.json();
        },
        onSuccess: (data) => {
            setMessages((prev) => [
                ...prev,
                {
                    id: prev.length + 2,
                    role: 'assistant',
                    content: data.response,
                    timestamp: new Date(),
                },
            ]);
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'No se pudo obtener una respuesta del AI',
                variant: 'destructive',
            });
        },
    });

    const handleSend = (message: string, files?: FileList) => {
        setMessages((prev) => [
            ...prev,
            {
                id: prev.length + 1,
                role: 'user',
                content: message,
                timestamp: new Date(),
            },
        ]);
        chatMutation.mutate({ prompt: message, files });
    };

    return (
        <div className="relative h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 pb-24">
                <Card className="mx-auto max-w-4xl">
                    <div className="space-y-4 p-4">
                        {messages.map((message) => (
                            <Message key={message.id} message={message} />
                        ))}
                        {chatMutation.isPending && (
                            <div className="flex justify-center">
                                <div className="animate-pulse text-muted-foreground">
                                    AI está pensando...
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
            <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 border-t">
                <div className="mx-auto max-w-4xl">
                    <MessageInput
                        onSend={handleSend}
                        disabled={chatMutation.isPending}
                    />
                </div>
            </div>
        </div>
    );
}
