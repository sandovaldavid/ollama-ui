import { QueryClient, QueryFunction } from '@tanstack/react-query';

const OLLAMA_URL = 'http://localhost:11434';
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

async function throwIfResNotOk(res: Response) {
    if (!res.ok) {
        const text = (await res.text()) || res.statusText;
        throw new Error(`${res.status}: ${text}`);
    }
}

export async function apiRequest(
    method: string,
    url: string,
    data?: unknown
): Promise<Response> {
    const isOllamaRequest = url.startsWith('/api/ollama');
    const baseUrl = isOllamaRequest ? OLLAMA_URL : API_BASE_URL;
    const finalUrl = isOllamaRequest ? url.replace('/api/ollama', '') : url;

    const res = await fetch(`${baseUrl}${finalUrl}`, {
        method,
        headers: data ? { 'Content-Type': 'application/json' } : {},
        body: data ? JSON.stringify(data) : undefined,
    });

    await throwIfResNotOk(res);
    return res;
}

type UnauthorizedBehavior = 'returnNull' | 'throw';
export const getQueryFn: <T>(options: {
    on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
    ({ on401: unauthorizedBehavior }) =>
    async ({ queryKey }) => {
        const res = await fetch(queryKey[0] as string, {
            credentials: 'include',
        });

        if (unauthorizedBehavior === 'returnNull' && res.status === 401) {
            return null;
        }

        await throwIfResNotOk(res);
        return await res.json();
    };

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: getQueryFn({ on401: 'throw' }),
            refetchInterval: false,
            refetchOnWindowFocus: false,
            staleTime: Infinity,
            retry: false,
        },
        mutations: {
            retry: false,
        },
    },
});
