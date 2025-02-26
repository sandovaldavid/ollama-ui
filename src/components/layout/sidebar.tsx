import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquarePlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Aquí podríamos manejar el estado de los chats
    const chats = [
        { id: 1, title: 'Chat #1' },
        { id: 2, title: 'Chat #2' },
    ];

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
