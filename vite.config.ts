import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import themePlugin from '@replit/vite-plugin-shadcn-theme-json';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), themePlugin()],
    envPrefix: 'VITE_',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@hooks': path.resolve(__dirname, './src/hooks'),
            '@lib': path.resolve(__dirname, './src/lib'),
            '@shared': path.resolve(__dirname, './shared'),
            '@server': path.resolve(__dirname, './server'),
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: path.resolve(__dirname, 'dist/public'),
        emptyOutDir: true,
    },
});
