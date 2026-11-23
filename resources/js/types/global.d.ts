import '@inertiajs/core';
import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            auth: { user: { id: number; name: string } | null };
            appName: string;
        };
        flashDataType: {
            toast?: { type: 'success' | 'error'; message: string };
        };
        errorValueType: string[];
        layoutProps: {
            title: string;
            showSidebar: boolean;
        };
        namedLayoutProps: {
            app: { title: string; theme: 'light' | 'dark' };
            content: { padding: string; maxWidth: string };
        };
    }
}
