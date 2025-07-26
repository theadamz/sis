import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ForwardedRef, forwardRef, ReactNode, useImperativeHandle, useState } from 'react';

export interface DialogSheetRef {
    open: () => void;
    close: () => void;
}

interface DialogSheetProps {
    children: React.ReactNode;
    title: string;
    description?: string;
    open?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
}

const DialogSheet = (
    { children, title, description, open = false, onOpen, onClose }: DialogSheetProps,
    ref: ForwardedRef<DialogSheetRef>,
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
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription>{description}</SheetDescription>
                </SheetHeader>
                {children}
            </SheetContent>
        </Sheet>
    );
};

export default forwardRef<DialogSheetRef, DialogSheetProps>(DialogSheet);
