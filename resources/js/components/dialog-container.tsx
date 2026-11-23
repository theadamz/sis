import React, { ForwardedRef, forwardRef, ReactNode, useEffect, useImperativeHandle, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';

export interface DialogContainerRef {
    open: () => void;
    close: () => void;
}

interface DialogContainerProps {
    className?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    title: string;
    description?: string;
    open?: boolean;
    preventInteractionOutside?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    showCloseButton?: boolean;
}

const DialogContainer = (
    {
        className,
        children,
        footer,
        title,
        description,
        open = false,
        preventInteractionOutside = true,
        showCloseButton = true,
        onOpen,
        onClose,
    }: DialogContainerProps,
    ref: ForwardedRef<DialogContainerRef>,
): ReactNode => {
    /*** componenet state ***/
    const [isOpen, setIsOpen] = useState<boolean>(open);

    /*** imperative ***/
    useImperativeHandle(ref, () => ({
        open: () => handleOpen(),
        close: () => handleClose(),
    }));

    useEffect(() => {
        if (isOpen && onOpen) onOpen();
        if (!isOpen && onClose) onClose();
    }, [isOpen]);

    /*** events ***/
    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent
                className={className}
                onInteractOutside={(e) => {
                    if (preventInteractionOutside) e.preventDefault();
                }}
                showCloseButton={showCloseButton}
            >
                <DialogHeader>
                    <DialogTitle className="text-start">{title}</DialogTitle>
                    <DialogDescription className="text-start">{description}</DialogDescription>
                </DialogHeader>
                <div className="overflow-x-auto overflow-y-hidden">{children}</div>
                {footer && <DialogFooter>{footer}</DialogFooter>}
            </DialogContent>
        </Dialog>
    );
};

export default forwardRef<DialogContainerRef, DialogContainerProps>(DialogContainer);
