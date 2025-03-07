import { Switch, Route } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import NotFound from '@/pages/not-found';
import Chat from '@/pages/chat';
import Home from '@/pages/home';
import { MainLayout } from '@/components/layout/main-layout';

function Router() {
    return (
        <MainLayout>
            <Switch>
                <Route path="/" component={Home} />
                <Route path="/chat" component={Chat} />
                <Route path="/chat/:chatId" component={Chat} />
                <Route component={NotFound} />
            </Switch>
        </MainLayout>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router />
            <Toaster />
        </QueryClientProvider>
    );
}

export default App;
