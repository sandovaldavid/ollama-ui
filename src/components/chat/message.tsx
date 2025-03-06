import { Card } from '@/components/ui/card';
import { Bot, User } from 'lucide-react';
import type { IMessage } from '@shared/schema';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Definir tu propio tipo de CodeProps
interface CodeProps {
    node?: any;
    inline?: boolean;
    className?: string;
    children: React.ReactNode;
}

type Message = IMessage & {
    _id: number;
};

interface MessageProps {
    message: Message;
}

export function Message({ message }: MessageProps) {
    const isUser = message.role === 'user';

    return (
        <Card className={`p-4 ${isUser ? 'bg-primary/10' : 'bg-background'}`}>
            <div className="flex items-start gap-3">
                <div
                    className={`p-2 rounded-lg ${
                        isUser ? 'bg-primary' : 'bg-secondary'
                    }`}
                >
                    {isUser ? (
                        <User className="h-5 w-5 text-primary-foreground" />
                    ) : (
                        <Bot className="h-5 w-5 text-secondary-foreground" />
                    )}
                </div>
                <div className="flex-1">
                    <div className="mb-1 text-sm font-medium">
                        {isUser ? 'Tú' : 'Asistente'}
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                        <ReactMarkdown
                            components={{
                                code({
                                    node,
                                    inline,
                                    className,
                                    children,
                                    ...props
                                }: CodeProps) {
                                    const match = /language-(\w+)/.exec(
                                        className || ''
                                    );
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            style={vscDarkPlus}
                                            language={match[1]}
                                            PreTag="div"
                                            {...props}
                                        >
                                            {String(children).replace(
                                                /\n$/,
                                                ''
                                            )}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code
                                            className={`${className} text-white px-1 py-0.5 rounded`}
                                            {...props}
                                        >
                                            {children}
                                        </code>
                                    );
                                },
                                p({ children }) {
                                    return (
                                        <p className="mb-4 text-gray-200">
                                            {children}
                                        </p>
                                    );
                                },
                                // Personalizar otros elementos Markdown para mayor legibilidad
                                h1({ children }) {
                                    return (
                                        <h1 className="text-xl font-bold mt-6 mb-4 text-gray-100">
                                            {children}
                                        </h1>
                                    );
                                },
                                h2({ children }) {
                                    return (
                                        <h2 className="text-lg font-bold mt-5 mb-3 text-gray-100">
                                            {children}
                                        </h2>
                                    );
                                },
                                h3({ children }) {
                                    return (
                                        <h3 className="text-lg font-bold mt-4 mb-2 text-gray-100">
                                            {children}
                                        </h3>
                                    );
                                },
                                ul({ children }) {
                                    return (
                                        <ul className="list-disc pl-6 mb-4 text-gray-200">
                                            {children}
                                        </ul>
                                    );
                                },
                                ol({ children }) {
                                    return (
                                        <ol className="list-decimal pl-6 mb-4 text-gray-200">
                                            {children}
                                        </ol>
                                    );
                                },
                                li({ children }) {
                                    return (
                                        <li className="mb-1 text-gray-200">
                                            {children}
                                        </li>
                                    );
                                },
                                a({ children, href }) {
                                    return (
                                        <a
                                            href={href}
                                            className="text-blue-400 hover:underline"
                                        >
                                            {children}
                                        </a>
                                    );
                                },
                                strong({ children }) {
                                    return (
                                        <strong className="mb-1 text-gray-200 font-bold">
                                            {children}
                                        </strong>
                                    );
                                },
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </Card>
    );
}
