import AuthLayoutTemplate from '@/layouts/auth/auth-split-layout';
import { type Quote } from '@/types';

export default function AuthLayout({
    children,
    title,
    description,
    quote,
    ...props
}: {
    children: React.ReactNode;
    title: string;
    description: string;
    quote?: Quote;
}) {
    return (
        <AuthLayoutTemplate title={title} description={description} quote={quote} {...props}>
            {children}
        </AuthLayoutTemplate>
    );
}
