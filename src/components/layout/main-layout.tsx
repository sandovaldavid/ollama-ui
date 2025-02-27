import { Navbar } from './navbar';
import { Sidebar } from './sidebar';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const [, setLocation] = useLocation();

    const chatsQuery = useQuery({
        queryKey: ['chats'],
        queryFn: () =>
            apiRequest('GET', '/api/chats').then((res) => res.json()),
    });

    return (
        <div className="flex h-screen flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    chats={chatsQuery.data || []}
                    onSelectChat={(chatId) => setLocation(`/chat/${chatId}`)}
                    onNewChat={() => setLocation('/chat')}
                />
                <main className="flex-1 overflow-auto">{children}</main>
            </div>
        </div>
    );
}
