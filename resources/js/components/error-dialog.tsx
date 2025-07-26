import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'sonner';

type ErrorDialogProps = {
    title?: string;
    description?: string;
    message: string | ReactNode;
    onClose?: () => void;
    onCopy?: (message: string | ReactNode) => void;
};

interface ErrorDialogController {
    show: (props?: ErrorDialogProps) => void;
    hide: () => void;
}

let controller: ErrorDialogController | null = null;

const errorDialog = {
    register: (ctrl: ErrorDialogController) => {
        controller = ctrl;
    },
    show: (props?: ErrorDialogProps) => {
        controller?.show(props);
    },
    hide: () => {
        controller?.hide();
    },
};

const ErrorDialogModal = (): ReactNode => {
    const defProps: ErrorDialogProps = {
        title: 'Error',
        description: 'Error has been occurred, see below to know more.',
        message: 'No message available.',
    } as ErrorDialogProps;

    /*** componenet state ***/
    const [open, setOpen] = useState<boolean>(false);
    const [props, setProps] = useState<ErrorDialogProps>(defProps);

    /*** effects ***/
    useEffect(() => {
        errorDialog.register({
            show: (props?: ErrorDialogProps) => handleShow(props),
            hide: () => handleClose(),
        });
    }, []);

    useEffect(() => {
        if (!open) {
            setProps(defProps);
        }
    }, [open]);

    /*** events ***/
    const handleShow = (newProps?: ErrorDialogProps) => {
        // set state
        if (newProps) setProps({ ...props, ...newProps });

        // open modal
        setOpen(true);
    };

    const handleClose = () => {
        // hide modal
        setOpen(false);
    };

    const handleCopy = async () => {
        if (props.message !== undefined && typeof props.message === 'string') {
            await navigator.clipboard.writeText(props.message);
            toast.info('Info', { description: 'Copy Success' });
        } else {
            toast.warning('Warning', { description: 'Cannot copy, please contact your administrator.' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-1/2">
                <DialogHeader>
                    <DialogTitle>{props.title}</DialogTitle>
                    <DialogDescription>{props.description}</DialogDescription>
                </DialogHeader>
                <ScrollArea className="bg-secondary h-96 w-full rounded-md p-1">
                    <div className="text-danger flex flex-col text-sm">{props.message}</div>
                </ScrollArea>
                <DialogFooter className="flex justify-between">
                    <DialogTrigger asChild>
                        <Button type="button" variant={'secondary'} onClick={handleClose}>
                            Close
                        </Button>
                    </DialogTrigger>
                    <Button type="button" onClick={handleCopy}>
                        Copy
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export { errorDialog, ErrorDialogModal };
