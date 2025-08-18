import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ReactNode, useEffect, useState } from 'react';

type Variant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'normal' | 'success' | 'info' | 'danger' | 'warning';
type ConfirmDialogResponse = boolean | 'yes' | 'no' | 'cancel';

type ConfirmDialogProps = {
    title?: string;
    message?: string | ReactNode;
    ConfirmButtonLabel?: string | ReactNode;
    ConfirmButtonvariant?: Variant;
    DenyButtonLabel?: string | ReactNode;
    DenyButtonvariant?: Variant;
    CancelButtonLabel?: string | ReactNode;
    CancelButtonvariant?: Variant;
};

interface ConfirmDialogController {
    YesNo: (props?: ConfirmDialogProps) => void;
    YesNoCancel: (props?: ConfirmDialogProps) => void;
}

let controller: ConfirmDialogController | null = null;
let resolver: ((response: ConfirmDialogResponse) => void) | null = null;

const confirmDialog = {
    YesNo: (props?: ConfirmDialogProps): Promise<ConfirmDialogResponse> => {
        return new Promise((resolve) => {
            resolver = resolve;
            controller?.YesNo(props);
        });
    },
    YesNoCancel: (props?: ConfirmDialogProps): Promise<ConfirmDialogResponse> => {
        return new Promise((resolve) => {
            resolver = resolve;
            controller?.YesNoCancel(props);
        });
    },
};

const ConfirmDialogModal = (): ReactNode => {
    const defProps: ConfirmDialogProps = {
        title: 'Confirmation',
        message: 'Are you sure?',
        ConfirmButtonLabel: 'Yes',
        ConfirmButtonvariant: 'default',
        DenyButtonLabel: 'No',
        DenyButtonvariant: 'outline',
        CancelButtonLabel: 'Cancel',
        CancelButtonvariant: 'outline',
    };

    /*** componenet state ***/
    const [open, setOpen] = useState<boolean>(false);
    const [props, setProps] = useState<ConfirmDialogProps>(defProps);
    const [useCancel, setUseCancel] = useState<boolean>(false);

    /*** effects ***/
    useEffect(() => {
        controller = {
            YesNo: (props?: ConfirmDialogProps) => handleShowYesNo(props),
            YesNoCancel: (props?: ConfirmDialogProps) => handleShowYesNoCancel(props),
        } as ConfirmDialogController;
    }, []);

    useEffect(() => {
        if (!open) {
            setProps(defProps);
        }
    }, [open]);

    /*** events ***/
    const handleShowYesNo = async (newProps?: ConfirmDialogProps) => {
        // set state
        if (newProps) setProps({ ...props, ...newProps });
        setUseCancel(false);

        // open modal
        setOpen(true);
    };

    const handleShowYesNoCancel = (newProps?: ConfirmDialogProps) => {
        // set state
        if (newProps) setProps({ ...props, ...newProps });
        setUseCancel(true);

        // open modal
        setOpen(true);
    };

    const handleConfirmCancel = () => {
        resolver?.('cancel');

        // close modal
        setOpen(false);
    };

    const handleConfirmNo = () => {
        resolver?.(useCancel ? 'no' : false);

        // close modal
        setOpen(false);
    };

    const handleConfirmYes = () => {
        resolver?.(useCancel ? 'yes' : true);

        // close modal
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>{props.title}</DialogTitle>
                    <DialogDescription>{props.message}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    {useCancel && (
                        <Button variant={props.CancelButtonvariant} onClick={handleConfirmCancel}>
                            {props.CancelButtonLabel}
                        </Button>
                    )}
                    <Button variant={props.DenyButtonvariant} onClick={handleConfirmNo} autoFocus={false}>
                        {props.DenyButtonLabel}
                    </Button>
                    <Button variant={props.ConfirmButtonvariant} onClick={handleConfirmYes} autoFocus={true}>
                        {props.ConfirmButtonLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export { confirmDialog, ConfirmDialogModal };
