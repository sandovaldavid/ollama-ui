import { Navbar } from './navbar';
import { Sidebar } from './sidebar';

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="flex h-screen flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-auto">{children}</main>
            </div>
        </div>
    );
}
