import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { HttpStatusCode } from 'axios';
import { ArrowLeftIcon, HomeIcon } from 'lucide-react';
import { ReactNode } from 'react';

type ErrorPageProps = {
    status: number;
    message: string;
};

export default function ErrorPage({ status, message }: Readonly<ErrorPageProps>): ReactNode {
    const { auth, prev_url } = usePage<SharedData>().props;

    return (
        <>
            <Head title={`${status}: ${HttpStatusCode[status]}`} />
            <div className="m-auto w-auto rounded-md bg-white p-4 shadow-md">
                <span className="text-center text-4xl font-bold">
                    {status}: {HttpStatusCode[status]}
                </span>
                <div className="bg-secondary my-4 p-4 text-center">{message}</div>
                <div className="mt-5 flex justify-between">
                    <Button onClick={() => prev_url && router.visit(prev_url)}>
                        <ArrowLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => router.visit(auth.user.def_path)} variant={'outline'}>
                        <HomeIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </>
    );
}
