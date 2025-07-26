import { cn } from '@/lib/utils';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

type SpinnerProps = {
    show?: boolean;
    message?: string | ReactNode;
    className?: string;
};

const Spinner = ({ show = true, message = 'Loading...', className }: SpinnerProps): ReactNode => {
    return (
        <div className={cn('flex w-full items-center justify-center', show === true ? '' : 'hidden', className)}>
            <Loader2 className="mr-2 size-4 animate-spin text-gray-500" />
            <Label className="text-sm text-gray-500">{message}</Label>
        </div>
    );
};
export { Spinner };
