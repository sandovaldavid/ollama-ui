import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Code2, Brain, Wrench, Sparkles, Loader2 } from 'lucide-react';
import { MessageInput } from '@/components/chat/message-input';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

const recommendations = [
    {
        icon: <Code2 className="w-8 h-8" />,
        title: 'Completar código',
        description:
            'Genera código basado en comentarios o requisitos específicos',
        example:
            'Escribe una función en Python que ordene un array usando quicksort.',
    },
    {
        icon: <Brain className="w-8 h-8" />,
        title: 'Explicar código',
        description:
            'Obtén explicaciones detalladas sobre fragmentos de código',
        example:
            'Explícame cómo funciona este código: function bubbleSort(arr) {...}',
    },
    {
        icon: <Wrench className="w-8 h-8" />,
        title: 'Depurar código',
        description: 'Encuentra y corrige errores en tu código',
        example: '¿Qué está mal en este código? for(i=0; i<10, i++) {...}',
    },
    {
        icon: <Sparkles className="w-8 h-8" />,
        title: 'Optimizar código',
        description: 'Mejora el rendimiento y la calidad de tu código',
        example:
            'Optimiza este ciclo for que itera sobre un array de 10,000 elementos.',
    },
];

export default function Home() {
    const [_, setLocation] = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingState, setLoadingState] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');

    const handleRecommendationClick = (example: string) => {
        setInputValue(example);
    };

    const handleSendMessage = async (message: string) => {
        if (!message.trim()) return;

        setIsLoading(true);
        try {
            // 1. Crear el chat
            setLoadingState('Creando nuevo chat...');
            const chatResponse = await apiRequest('POST', '/api/chats', {
                title:
                    message.slice(0, 30) + (message.length > 30 ? '...' : ''),
            });

            if (!chatResponse.ok) {
                throw new Error('Error al crear el chat');
            }

            const chat = await chatResponse.json();

            // 2. Guardar el mensaje inicial
            setLoadingState('Enviando tu mensaje...');
            const messageResponse = await apiRequest(
                'POST',
                `/api/chats/${chat._id}/messages`,
                {
                    messages: [
                        {
                            role: 'user',
                            content: message,
                            chatId: chat._id,
                            timestamp: new Date().toISOString(),
                        },
                    ],
                }
            );

            if (!messageResponse.ok) {
                throw new Error('Error al guardar el mensaje');
            }

            // 3. Enviar al modelo de Ollama
            setLoadingState('La IA está pensando...');
            const ollamaResponse = await apiRequest(
                'POST',
                '/api/ollama/api/generate',
                {
                    model: import.meta.env.VITE_OLLAMA_MODEL,
                    prompt: message,
                    stream: false,
                }
            );

            if (!ollamaResponse.ok) {
                throw new Error('Error al comunicarse con el modelo de IA');
            }

            const ollamaData = await ollamaResponse.json();

            // 4. Guardar la respuesta del asistente
            setLoadingState('Guardando la respuesta...');
            await apiRequest('POST', `/api/chats/${chat._id}/messages`, {
                messages: [
                    {
                        role: 'assistant',
                        content: ollamaData.response,
                        chatId: chat._id,
                        timestamp: new Date().toISOString(),
                    },
                ],
            });

            // 5. Finalmente redirigir al chat
            setLoadingState('Redirigiendo al chat...');
            setLocation(`/chat/${chat._id}`);
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Error',
                description:
                    error instanceof Error
                        ? error.message
                        : 'Ocurrió un error al procesar tu solicitud',
                variant: 'destructive',
            });
            setIsLoading(false);
            setLoadingState(null);
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">
                    Bienvenido a DeepSeek Chat
                </h1>
                <p className="text-muted-foreground mb-8">
                    Selecciona una sugerencia o escribe tu pregunta para
                    comenzar
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {recommendations.map((item, index) => (
                        <TooltipProvider key={index}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Card
                                        className="cursor-pointer hover:bg-accent/50 transition-colors"
                                        onClick={() =>
                                            handleRecommendationClick(
                                                item.example
                                            )
                                        }
                                    >
                                        <CardHeader>
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <CardTitle>
                                                        {item.title}
                                                    </CardTitle>
                                                    <CardDescription>
                                                        {item.description}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                    Clic para usar un ejemplo
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </div>

                <Card className="p-4">
                    {isLoading ? (
                        <CardContent className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                            <p className="text-lg font-medium">
                                {loadingState}
                            </p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => {
                                    setIsLoading(false);
                                    setLoadingState(null);
                                }}
                            >
                                Cancelar
                            </Button>
                        </CardContent>
                    ) : (
                        <MessageInput
                            onSend={handleSendMessage}
                            value={inputValue}
                            onChange={setInputValue}
                            placeholder="Escribe tu pregunta o selecciona una sugerencia..."
                        />
                    )}
                </Card>
            </div>
        </div>
    );
}
