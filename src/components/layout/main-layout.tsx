import { Navbar } from './navbar';
import { Sidebar } from './sidebar';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { toast } from '@/hooks/use-toast';

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const [, setLocation] = useLocation();
    const queryClient = useQueryClient();

    const chatsQuery = useQuery({
        queryKey: ['chats'],
        queryFn: () =>
            apiRequest('GET', '/api/chats').then((res) => res.json()),
    });

    const handleRenameChat = async (chatId: number, newName: string) => {
        try {
            const response = await apiRequest('PATCH', `/api/chats/${chatId}`, {
                title: newName,
            });

            if (!response.ok) {
                throw new Error('Error al renombrar el chat');
            }

            queryClient.invalidateQueries({ queryKey: ['chats'] });

            toast({
                title: 'Éxito',
                description: 'Chat renombrado correctamente',
            });
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Error',
                description: 'No se pudo renombrar el chat',
                variant: 'destructive',
            });
        }
    };

    const handleDeleteChat = async (chatId: number) => {
        try {
            const response = await apiRequest('DELETE', `/api/chats/${chatId}`);

            if (!response.ok) {
                throw new Error('Error al eliminar el chat');
            }

            queryClient.invalidateQueries({ queryKey: ['chats'] });

            toast({
                title: 'Éxito',
                description: 'Chat eliminado correctamente',
            });

            const currentPath = window.location.pathname;
            if (currentPath === `/chat/${chatId}`) {
                setLocation('/');
            }
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Error',
                description: 'No se pudo eliminar el chat',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="flex h-screen flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    chats={chatsQuery.data || []}
                    onSelectChat={(chatId) => setLocation(`/chat/${chatId}`)}
                    onNewChat={() => setLocation('/')}
                    onRenameChat={handleRenameChat}
                    onDeleteChat={handleDeleteChat}
                />
                <main className="flex-1 overflow-auto">{children}</main>
            </div>
        </div>
    );
}
