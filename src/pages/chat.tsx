import { useState, useEffect } from 'react';
import mongoose from 'mongoose';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Message } from '@/components/chat/message';
import { MessageInput } from '@/components/chat/message-input';
import { apiRequest } from '@/lib/queryClient';
import type { IMessage as MessageType } from '@shared/schema';
import { useParams, useLocation } from 'wouter';

type Message = MessageType & {
    _id: number;
};

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const { chatId } = useParams();
    const [, setLocation] = useLocation();
    const { toast } = useToast();

    if (!chatId) {
        console.log('No hay chatId, redirigiendo a /');
        setLocation('/');
        return null;
    }

    const messagesQuery = useQuery({
        queryKey: ['messages', chatId],
        queryFn: () =>
            apiRequest('GET', `/api/chats/${chatId}/messages`).then((res) =>
                res.json()
            ),
        enabled: !!chatId,
    });

    useEffect(() => {
        if (messagesQuery.isError) {
            toast({
                title: 'Error',
                description: 'Error al cargar los mensajes',
                variant: 'destructive',
            });
        }
    }, [messagesQuery.isError]);

    useEffect(() => {
        if (messagesQuery.data) {
            setMessages(messagesQuery.data);
        }
    }, [messagesQuery.data]);

    const chatMutation = useMutation({
        mutationFn: async (data: { prompt: string; files?: FileList }) => {
            try {
                const ollamaResponse = await apiRequest(
                    'POST',
                    '/api/ollama/api/generate',
                    {
                        model: import.meta.env.VITE_OLLAMA_MODEL,
                        prompt: data.prompt,
                        stream: false,
                    }
                );

                const ollamaData = await ollamaResponse.json();

                // Ensure chatId is a valid MongoDB ObjectId string
                if (!mongoose.Types.ObjectId.isValid(chatId)) {
                    throw new Error('Invalid chat ID');
                }

                const messages = [
                    {
                        role: 'user' as const,
                        content: data.prompt,
                        chatId, // Use the string ID directly
                        timestamp: new Date().toISOString(),
                    },
                    {
                        role: 'assistant' as const,
                        content: ollamaData.response,
                        chatId,
                        timestamp: new Date().toISOString(),
                    },
                ];

                const saveResponse = await apiRequest(
                    'POST',
                    `/api/chats/${chatId}/messages`,
                    { messages }
                );

                return saveResponse.json();
            } catch (error) {
                console.error('Error en la mutación:', error);
                toast({
                    title: 'Error',
                    description: 'Error al enviar el mensaje',
                    variant: 'destructive',
                });
                throw error;
            }
        },
    });

    const handleSend = (message: string, files?: FileList) => {
        chatMutation.mutate(
            { prompt: message, files },
            {
                onSuccess: (data) => {
                    // Los mensajes vienen de la BD con IDs correctos
                    setMessages((prev) => [...prev, ...data]);
                },
            }
        );
    };

    return (
        <div className="relative h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 pb-24">
                <Card className="mx-auto max-w-4xl">
                    <div className="space-y-4 p-4">
                        {messagesQuery.isLoading ? (
                            <div className="flex justify-center">
                                <div className="animate-pulse">
                                    Cargando mensajes...
                                </div>
                            </div>
                        ) : messagesQuery.isError ? (
                            <div className="text-destructive text-center">
                                Error al cargar los mensajes
                            </div>
                        ) : (
                            <>
                                {messages.map((message) => (
                                    <Message
                                        key={message._id.toString()}
                                        message={message}
                                    />
                                ))}
                                {chatMutation.isPending && (
                                    <div className="flex justify-center">
                                        <div className="animate-pulse text-muted-foreground">
                                            AI está pensando...
                                        </div>
                                    </div>
                                )}
                            </>
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
