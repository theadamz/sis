import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoaderIcon } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';

type LoadingDialogProps = {
    title?: string;
    message?: string | ReactNode;
};

interface LoadingDialogController {
    show: (props?: LoadingDialogProps) => void;
    hide: () => void;
}

let controller: LoadingDialogController | null = null;

const loadingDialog = {
    register: (ctrl: LoadingDialogController) => {
        controller = ctrl;
    },
    show: (props?: LoadingDialogProps) => {
        controller?.show(props);
    },
    hide: () => {
        controller?.hide();
    },
};

const LoadingDialogModal = (): ReactNode => {
    /*** componenet state ***/
    const [open, setOpen] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('Loading...');
    const [message, setMessage] = useState<string | ReactNode>('Please wait while we process your request.');

    /*** events ***/
    useEffect(() => {
        loadingDialog.register({
            show: (props?: LoadingDialogProps) => handleShow(props),
            hide: () => handleHide(),
        });
    }, []);

    /*** events ***/
    const handleShow = (props?: LoadingDialogProps) => {
        // decomposit
        const { title = 'Loading...', message = 'Please wait while we process your request.' } = props || {};

        // set state
        setTitle(title);
        setMessage(message);

        // open modal
        setOpen(true);
    };

    const handleHide = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent onInteractOutside={(e) => e.preventDefault()} className="[&>button]:hidden" onFocus={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="flex">
                        <LoaderIcon className="mr-2 size-4 animate-spin" />
                        {title}
                    </DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { loadingDialog, LoadingDialogModal };
