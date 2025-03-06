import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    MessageSquarePlus,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Pencil,
    Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { IChat } from '@shared/schema';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type Chat = IChat & {
    _id: number;
};

interface SidebarProps {
    chats?: Chat[];
    onNewChat?: () => void;
    onSelectChat?: (chatId: number) => void;
    onRenameChat?: (chatId: number, newName: string) => void;
    onDeleteChat?: (chatId: number) => void;
}

export function Sidebar({
    chats = [],
    onNewChat,
    onSelectChat,
    onRenameChat,
    onDeleteChat,
}: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [chatToRename, setChatToRename] = useState<Chat | null>(null);
    const [newChatName, setNewChatName] = useState('');
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);

    const handleRename = () => {
        if (chatToRename && newChatName.trim()) {
            onRenameChat?.(chatToRename._id, newChatName);
            setIsRenameDialogOpen(false);
            setChatToRename(null);
            setNewChatName('');
        }
    };

    const handleDelete = () => {
        if (chatToDelete) {
            onDeleteChat?.(chatToDelete._id);
            setIsDeleteDialogOpen(false);
            setChatToDelete(null);
        }
    };

    const openRenameDialog = (chat: Chat) => {
        setChatToRename(chat);
        setNewChatName(chat.title);
        setIsRenameDialogOpen(true);
    };

    const openDeleteDialog = (chat: Chat) => {
        setChatToDelete(chat);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div
            className={cn(
                'flex h-full flex-col border-r relative transition-all duration-300',
                isCollapsed ? 'w-16' : 'w-68'
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
                        <div
                            key={chat._id.toString()}
                            className="flex items-center justify-between group hover:bg-gray-100/10 rounded-md"
                        >
                            <Button
                                variant="ghost"
                                className={cn(
                                    'flex-grow text-left',
                                    isCollapsed
                                        ? 'justify-center px-0'
                                        : 'justify-start'
                                )}
                                onClick={() => onSelectChat?.(chat._id)}
                            >
                                <MessageSquarePlus className="h-4 w-4 shrink-0" />
                                {!isCollapsed && (
                                    <span className="truncate ml-2">
                                        {chat.title}
                                    </span>
                                )}
                            </Button>

                            {!isCollapsed && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 p-0 opacity-70 hover:opacity-100"
                                        >
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() =>
                                                openRenameDialog(chat)
                                            }
                                        >
                                            <Pencil className="h-4 w-4 mr-2" />
                                            Renombrar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                openDeleteDialog(chat)
                                            }
                                            className="text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Eliminar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    ))}
                </div>
            </ScrollArea>

            {/* Los diálogos se mantienen igual */}
            <Dialog
                open={isRenameDialogOpen}
                onOpenChange={setIsRenameDialogOpen}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Renombrar chat</DialogTitle>
                        <DialogDescription>
                            Introduce un nuevo nombre para este chat
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Input
                            value={newChatName}
                            onChange={(e) => setNewChatName(e.target.value)}
                            placeholder="Nombre del chat"
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsRenameDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleRename}>Guardar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Eliminar chat</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que quieres eliminar este chat?
                            Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
