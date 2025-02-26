import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Code2, Brain, Wrench, Sparkles } from 'lucide-react';
import { MessageInput } from '@/components/chat/message-input';
import { useLocation } from 'wouter';

const recommendations = [
    {
        icon: <Code2 className="w-8 h-8" />,
        title: 'Completar código',
        description:
            'Genera código basado en comentarios o requisitos específicos',
    },
    {
        icon: <Brain className="w-8 h-8" />,
        title: 'Explicar código',
        description:
            'Obtén explicaciones detalladas sobre fragmentos de código',
    },
    {
        icon: <Wrench className="w-8 h-8" />,
        title: 'Depurar código',
        description: 'Encuentra y corrige errores en tu código',
    },
    {
        icon: <Sparkles className="w-8 h-8" />,
        title: 'Optimizar código',
        description: 'Mejora el rendimiento y la calidad de tu código',
    },
];

export default function Home() {
    const [_, setLocation] = useLocation();

    const handleSendMessage = (message: string) => {
        setLocation('/chat');
    };

    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">
                    Bienvenido a DeepSeek Chat
                </h1>
                <p className="text-muted-foreground mb-8">
                    Selecciona una de las siguientes opciones para comenzar
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {recommendations.map((item, index) => (
                        <Card
                            key={index}
                            className="cursor-pointer hover:bg-accent/50 transition-colors"
                        >
                            <CardHeader>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <CardTitle>{item.title}</CardTitle>
                                        <CardDescription>
                                            {item.description}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                <Card className="p-4">
                    <MessageInput onSend={handleSendMessage} />
                </Card>
            </div>
        </div>
    );
}
