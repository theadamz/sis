import { ConfirmDialogModal } from '@/components/confirm-dialog';
import { LoadingDialogModal } from '@/components/loading-dialog';
import { SidebarInset } from '@/components/ui/sidebar';
import * as React from 'react';
import { ErrorDialogModal } from './error-dialog';
import { Toaster } from './ui/sonner';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({ variant = 'sidebar', children, ...props }: AppContentProps) {
    if (variant === 'sidebar') {
        return <SidebarInset {...props}>{children}</SidebarInset>;
    }

    return (
        <main className="mx-auto flex h-full w-full flex-1 flex-col gap-4 rounded-xl" {...props}>
            {children}
            <Toaster richColors={true} expand={true} position="top-left" />
            <LoadingDialogModal />
            <ConfirmDialogModal />
            <ErrorDialogModal />
        </main>
    );
}
