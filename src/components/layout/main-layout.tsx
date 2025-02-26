import { Navbar } from './navbar';
import { Sidebar } from './sidebar';
import { useQuery } from 'react-query';
import { apiRequest } from '@/lib/queryClient';

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const chatsQuery = useQuery({
        queryKey: ['chats'],
        queryFn: () =>
            apiRequest('GET', '/api/chats').then((res) => res.json()),
    });

    return (
        <div className="flex h-screen flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar chats={chatsQuery.data || []} />
                <main className="flex-1 overflow-auto">{children}</main>
            </div>
        </div>
    );
}
