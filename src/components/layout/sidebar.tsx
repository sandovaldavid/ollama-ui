import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquarePlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { chats } from '@shared/schema';

type Chat = typeof chats.$inferSelect;

interface SidebarProps {
    chats?: Chat[];
    onNewChat?: () => void;
    onSelectChat?: (chatId: number) => void;
}

export function Sidebar({ chats = [], onNewChat, onSelectChat }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div
            className={cn(
                'flex h-full flex-col border-r relative transition-all duration-300',
                isCollapsed ? 'w-16' : 'w-60'
            )}
        >
            <Button
                variant="ghost"
                size="icon"
                className="absolute -right-4 top-2 z-10 rounded-full border"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                {isCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                ) : (
                    <ChevronLeft className="h-4 w-4" />
                )}
            </Button>

            <div className="p-4">
                <Button
                    className={cn(
                        'w-full justify-start gap-2',
                        isCollapsed && 'justify-center px-0'
                    )}
                    onClick={onNewChat}
                >
                    <MessageSquarePlus className="h-4 w-4" />
                    {!isCollapsed && 'Nuevo Chat'}
                </Button>
            </div>

            <ScrollArea className="flex-1 px-2">
                <div className="space-y-2 p-2">
                    {chats.map((chat) => (
                        <Button
                            key={chat.id}
                            variant="ghost"
                            className={cn(
                                'w-full',
                                isCollapsed
                                    ? 'justify-center px-0'
                                    : 'justify-start'
                            )}
                            onClick={() => onSelectChat?.(chat.id)}
                        >
                            <MessageSquarePlus className="h-4 w-4" />
                            {!isCollapsed && chat.title}
                        </Button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
