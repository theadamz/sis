import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { DateTime } from 'luxon';
import * as React from 'react';

interface AppFooterProps extends React.ComponentProps<'section'> {
    variant?: 'header' | 'sidebar';
}

export function AppFooter({ variant = 'sidebar', ...props }: AppFooterProps) {
    const page = usePage<SharedData>();
    const { config } = page.props;

    if (variant === 'sidebar') return null;

    return (
        <section className="sticky bottom-0 border-t-1 shadow-md" {...props}>
            <div className="flex w-full justify-between bg-white shadow-xl dark:bg-black">
                <div className="px-6 py-1 text-sm text-gray-500">{DateTime.now().setLocale(config.locale).toFormat('cccc, d MMMM y')}</div>
                <div className="px-6 py-1 text-sm text-gray-500">{page.props.auth.user.site_name}</div>
            </div>
        </section>
    );
}
