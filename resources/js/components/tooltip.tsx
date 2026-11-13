import { PropsWithChildren, ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface TooltipProps {
    caption: string | ReactNode;
}

const TooltipWrapper = ({ children, caption }: PropsWithChildren<TooltipProps>): ReactNode => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent>{typeof caption === 'string' ? <p>{caption}</p> : caption}</TooltipContent>
        </Tooltip>
    );
};

export default TooltipWrapper;
