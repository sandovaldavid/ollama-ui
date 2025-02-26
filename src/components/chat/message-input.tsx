import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Command, X } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface MessageInputProps {
    onSend: (message: string, files?: FileList) => void;
    disabled?: boolean;
}

const commands = [
    { id: 'code', label: '/code', description: 'Generar código' },
    { id: 'image', label: '/image', description: 'Generar una imagen' },
    {
        id: 'paraphrase',
        label: '/paraphrase',
        description: 'Parafrasear texto',
    },
];

export function MessageInput({ onSend, disabled }: MessageInputProps) {
    const [message, setMessage] = useState('');
    const [showCommands, setShowCommands] = useState(false);
    const [activeCommand, setActiveCommand] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (
            message.trim() ||
            (fileInputRef.current?.files &&
                fileInputRef.current.files.length > 0)
        ) {
            const finalMessage = activeCommand
                ? `${activeCommand} ${message}`
                : message;
            onSend(
                finalMessage.trim(),
                fileInputRef.current?.files || undefined
            );
            setMessage('');
            setActiveCommand(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        } else if (e.key === '/' && message === '') {
            e.preventDefault();
            setShowCommands(true);
        } else if (e.key === 'Backspace' && activeCommand) {
            const cursorPosition = textareaRef.current?.selectionStart || 0;
            const commandEndPosition = 0;
            if (cursorPosition <= commandEndPosition) {
                e.preventDefault();
                setMessage('');
                setActiveCommand(null);
            }
        }
    };

    const handleCommandClick = (command: string) => {
        setActiveCommand(command);
        setMessage('');
        setShowCommands(false);
        textareaRef.current?.focus();
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;

        if (newValue.startsWith('/')) {
            const commandMatch = newValue.match(/^\/\w+/);
            if (commandMatch) {
                const command = commandMatch[0];
                if (commands.some((cmd) => cmd.label === command)) {
                    setActiveCommand(command);
                    setMessage(newValue.slice(command.length).trim());
                    return;
                }
            }
            if (newValue === '/') {
                setShowCommands(true);
            }
        }

        setMessage(newValue);
    };

    const handleFileChange = () => {
        if (message.trim() && fileInputRef.current?.files?.length) {
            handleSubmit({ preventDefault: () => {} } as React.FormEvent);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept="image/*,.pdf,.txt"
            />
            <div className="relative flex-1">
                <div className="relative">
                    {activeCommand && (
                        <div className="absolute top-2 left-2 z-10 bg-primary/10 text-primary rounded px-2 py-1 text-sm font-mono flex items-center gap-1">
                            {activeCommand}
                            <button
                                type="button"
                                className="ml-1 hover:text-primary/80"
                                onClick={() => {
                                    setMessage('');
                                    setActiveCommand(null);
                                }}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    )}
                    <Textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            activeCommand
                                ? 'Escribe tu mensaje...'
                                : 'Escribe un mensaje o usa / para comandos...'
                        }
                        className={`resize-none pr-10 ${activeCommand ? 'pl-28' : ''}`}
                        disabled={disabled}
                        rows={2}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled}
                    >
                        <Paperclip className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Popover open={showCommands} onOpenChange={setShowCommands}>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" type="button">
                        <Command className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2" align="end">
                    <div className="space-y-1">
                        {commands.map((cmd) => (
                            <Button
                                key={cmd.id}
                                variant="ghost"
                                className="w-full justify-start text-left"
                                onClick={() => handleCommandClick(cmd.label)}
                            >
                                <span className="font-mono">{cmd.label}</span>
                                <span className="ml-2 text-muted-foreground">
                                    {cmd.description}
                                </span>
                            </Button>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>

            <Button
                type="submit"
                disabled={
                    disabled ||
                    (!message.trim() && !fileInputRef.current?.files?.length)
                }
            >
                <Send className="h-4 w-4" />
            </Button>
        </form>
    );
}
