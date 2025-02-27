/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_OLLAMA_URL: string;
    readonly VITE_OLLAMA_MODEL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
