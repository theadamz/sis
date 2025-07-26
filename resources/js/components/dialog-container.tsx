import { ForwardedRef, forwardRef, ReactNode, useImperativeHandle, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

export interface DialogContainerRef {
    open: () => void;
    close: () => void;
}

interface DialogContainerProps {
    className?: string;
    children: React.ReactNode;
    title: string;
    description?: string;
    open?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
}

const DialogContainer = (
    { className, children, title, description, open = false, onOpen, onClose }: DialogContainerProps,
    ref: ForwardedRef<DialogContainerRef>,
): ReactNode => {
    /*** componenet state ***/
    const [isOpen, setIsOpen] = useState<boolean>(open);

    /*** imperative ***/
    useImperativeHandle(ref, () => ({
        open: () => handleOpen(),
        close: () => handleClose(),
    }));

    /*** events ***/
    const handleOpen = () => {
        setIsOpen(true);
        if (onOpen) onOpen();
    };

    const handleClose = () => {
        setIsOpen(false);
        if (onClose) onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className={className}>
                <DialogHeader>
                    <DialogTitle className="text-start">{title}</DialogTitle>
                    <DialogDescription className="text-start">{description}</DialogDescription>
                </DialogHeader>
                <div className="overflow-x-auto overflow-y-hidden">{children}</div>
            </DialogContent>
        </Dialog>
    );
};

export default forwardRef<DialogContainerRef, DialogContainerProps>(DialogContainer);
