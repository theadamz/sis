import { confirmDialog } from '@/components/confirm-dialog';
import DialogContainer, { DialogContainerRef } from '@/components/dialog-container';
import { errorDialog } from '@/components/error-dialog';
import Select from '@/components/select';
import TooltipWrapper from '@/components/tooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import { generateRandomId } from '@/lib/utils';
import { type BreadcrumbItem, type InspectionFormItem, type InspectionFormSection, type InspectionType, type SharedData } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import _ from 'lodash';
import { ArrowLeftRight, CheckIcon, EditIcon, Loader2, MenuIcon, PlusIcon, XIcon } from 'lucide-react';
import { Fragment, ReactNode, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import FormSection from './form-section';
import FormSectionItem from './form-section-item';
import FormSectionItemMove from './form-section-item-move';

const breadcrumbsData: BreadcrumbItem[] = [
    {
        title: 'Basic',
    },
    {
        title: 'Inspection Form',
    },
    {
        title: 'Vehicles',
        href: route('basic.inspection-form.vehicle.index'),
    },
    {
        title: 'Create',
        href: route('basic.inspection-form.vehicle.create'),
    },
];

type Inspection = InspectionFormSection & {
    items: InspectionFormItem[];
};

type InspectionForm = {
    code: string;
    name: string;
    use_eta_dest: boolean;
    use_ata_dest: boolean;
    use_duration: boolean;
    is_publish: boolean;
    stage: string;
    inspections: Inspection[];
};

interface CreateProps {
    inspectionStages: InspectionType[];
}

const inspectionId = generateRandomId();

const Create = ({ inspectionStages }: CreateProps): ReactNode => {
    /*** inertia js ***/
    const { data, setData, post, processing, errors, reset, clearErrors, isDirty } = useForm<Required<InspectionForm>>({
        code: '',
        name: '',
        use_eta_dest: false,
        use_ata_dest: false,
        use_duration: false,
        is_publish: true,
        stage: '',
        inspections: [],
    });

    /*** references ***/
    const sectionForm = useRef<DialogContainerRef>(null);
    const sectionItemForm = useRef<DialogContainerRef>(null);
    const sectionItemMoveForm = useRef<DialogContainerRef>(null);

    /*** states ***/
    const [sectionFormTitle, setSectionFormTitle] = useState<string>('Create Section');
    const [sectionItemFormTitle, setSectionItemFormTitle] = useState<string>('Create Section Item');
    const [itemCount, setItemCount] = useState<number>(0);
    const [inspectionFormSectionData, setInspectionFormSectionData] = useState<InspectionFormSection>();
    const [inspectionFormSectionItemData, setInspectionFormSectionItemData] = useState<InspectionFormItem>();
    const [inspectionFormSectionItemMoveData, setInspectionFormSectionItemMoveData] = useState<InspectionFormItem>();

    /*** effects ***/
    useEffect(() => {
        setItemCount((prevItemCount) => {
            let count = 0;
            data.inspections.forEach((inspection) => {
                count += inspection.items.length;
            });
            return count;
        });
    }, [data.inspections]);

    /*** events ***/
    const submitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('basic.inspection-form.vehicle.store'), {
            onSuccess: async (response) => {
                const props = response.props as unknown as SharedData;
                const flash = props.flash;
                if (flash.toast) toast.success(flash.toast.title, { description: flash.toast.message });

                // confirmation create new data
                const confirmation = await confirmDialog.YesNo({ message: 'Create new inspection form?' });
                if (confirmation) {
                    resetForm();
                } else {
                    router.visit(route('basic.inspection-form.vehicle.index'), {
                        replace: true,
                    });
                }
            },
            onError: async (errors) => {
                if (errors.error) {
                    errorDialog.show({
                        message: errors.error,
                    });
                } else {
                    errorDialog.show({
                        title: 'Warning',
                        description: 'Please fill all required input',
                        message: refactorErrorMessage(errors),
                    });
                }
            },
            preserveState: true,
        });
    };

    const resetForm = () => {
        reset(); // clear form to initial values
        clearErrors(); // clear errors
        setData({
            code: '',
            name: '',
            use_eta_dest: false,
            use_ata_dest: false,
            use_duration: false,
            is_publish: true,
            stage: '',
            inspections: [],
        });
        setSectionFormTitle('Create Section');
        setSectionItemFormTitle('Create Section Item');
        setItemCount(0);
        setInspectionFormSectionData(undefined);
        setInspectionFormSectionItemData(undefined);
    };

    const handleCancel = async () => {
        if (isDirty) {
            // confirmation
            const confirmation = await confirmDialog.YesNo({
                message: `Are you sure want to cancel changes?`,
                ConfirmButtonvariant: 'normal',
            });
            if (!confirmation) return;
        }

        router.visit(route('basic.inspection-form.vehicle.index'), {
            replace: true,
        });
    };

    const handleInspectionFormSectionSubmit = (inspectionFormSection: InspectionFormSection) => {
        // check if id is empty
        if (inspectionFormSection.id) {
            setData((prevData) => {
                // get previous data without selected data
                const inspections = prevData.inspections.filter((item) => item.id !== inspectionFormSection.id);

                // get previous data and replace values
                const prevInspection = prevData.inspections.find((item) => item.id === inspectionFormSection.id);
                const updatedInspection: Inspection = {
                    ...prevInspection,
                    ...{
                        ...inspectionFormSection,
                        items: typeof prevInspection === 'undefined' ? [] : prevInspection.items,
                    },
                };

                // merge inspection with sort
                return {
                    ...prevData,
                    ...{ inspections: _.sortBy([...inspections, updatedInspection], ['seq']) },
                };
            });
        } else {
            const inspection: Inspection = {
                ...inspectionFormSection,
                id: generateRandomId(),
                inspection_vehicle_form_id: inspectionId,
                items: [],
            };

            // merge inspection with sort
            setData((prevData) => {
                return {
                    ...prevData,
                    ...{ inspections: _.sortBy([...prevData.inspections, inspection], ['seq']) },
                };
            });
        }

        sectionForm.current?.close();
    };

    const handleSectionEdit = (id: string) => {
        const section = data.inspections.find((section) => section.id === id);

        if (!section) {
            toast.error('Error', { description: 'Section not found.' });
            return;
        }

        setInspectionFormSectionData(section);

        setSectionFormTitle('Edit Section');

        sectionForm.current?.open();
    };

    const handleSectionRemove = async (section: InspectionFormSection) => {
        // confirmation
        const confirmation = await confirmDialog.YesNo({
            message: `Are you sure want to remove section ${section.description}?`,
            ConfirmButtonvariant: 'destructive',
        });
        if (!confirmation) return;

        setData((prevData) => {
            return {
                ...prevData,
                inspections: _.sortBy(
                    prevData.inspections.filter((item) => item.id !== section.id),
                    ['seq'],
                ),
            };
        });
    };

    const handleSectionItemCreate = (section: InspectionFormSection) => {
        setInspectionFormSectionData(section);

        sectionItemForm.current?.open();
    };

    const handleInspectionFormSectionItemSubmit = (inspectionFormSectionItem: InspectionFormItem) => {
        // check if id is empty
        if (inspectionFormSectionItem.id) {
            setData((prevData) => {
                // get sections / inspections without selected data
                const sections = prevData.inspections.filter(
                    (section) => section.id !== inspectionFormSectionItem.inspection_vehicle_form_section_id,
                );

                // get previous section with selected data
                const prevSection = prevData.inspections.find((item) => item.id === inspectionFormSectionItem.inspection_vehicle_form_section_id);
                if (!prevSection) return prevData;

                // get prev items without selected data
                const prevItems = prevSection.items.filter((item) => item.id !== inspectionFormSectionItem.id);
                if (!prevItems) return prevData;

                // update inspection items by add it
                const updatedInspection: Inspection = {
                    ...prevSection,
                    items: prevSection.items.length <= 0 ? [inspectionFormSectionItem] : _.sortBy([...prevItems, inspectionFormSectionItem], ['seq']),
                };

                // merge inspection with sort
                return {
                    ...prevData,
                    ...{ inspections: _.sortBy([...sections, updatedInspection], ['seq']) },
                };
            });
        } else {
            setData((prevData) => {
                // get previous data without selected data
                const inspections = prevData.inspections.filter((item) => item.id !== inspectionFormSectionItem.inspection_vehicle_form_section_id);

                // get previous data and replace values
                const prevInspection = prevData.inspections.find((item) => item.id === inspectionFormSectionItem.inspection_vehicle_form_section_id);

                // if prevInspection is undefined
                if (!prevInspection) return prevData;

                // set id
                inspectionFormSectionItem.id = generateRandomId();

                // update inspection items by add it
                const updatedInspection: Inspection = {
                    ...prevInspection,
                    items:
                        prevInspection.items.length <= 0
                            ? [inspectionFormSectionItem]
                            : _.sortBy([...prevInspection.items, inspectionFormSectionItem], ['seq']),
                };

                // merge inspection with sort
                return {
                    ...prevData,
                    ...{ inspections: _.sortBy([...inspections, updatedInspection], ['seq']) },
                };
            });
        }

        sectionItemForm.current?.close();
    };

    const handleInspectionFormSectionItemMoveSubmit = (inspectionFormSectionItem: InspectionFormItem) => {
        setData((prevData) => {
            // get sections / inspections without selected data
            const sections = prevData.inspections
                .filter((section) => section.id !== inspectionFormSectionItem.inspection_vehicle_form_section_id)
                .map((section) => {
                    return {
                        ...section,
                        ...{
                            items: section.items.filter((item) => {
                                return item.id !== inspectionFormSectionItem.id;
                            }),
                        },
                    };
                });

            // get new section with selected data
            const newSection = prevData.inspections.find((item) => item.id === inspectionFormSectionItem.inspection_vehicle_form_section_id);
            if (!newSection) return prevData;

            // get new section existing items without selected data
            const newSectionExistingItems = newSection.items.filter((item) => item.id !== inspectionFormSectionItem.id);

            // update inspection items by add it
            const updatedInspection: Inspection = {
                ...newSection,
                items:
                    newSection.items.length <= 0
                        ? [inspectionFormSectionItem]
                        : _.sortBy([...newSectionExistingItems, inspectionFormSectionItem], ['seq']),
            };

            // merge inspection with sort
            return {
                ...prevData,
                ...{ inspections: _.sortBy([...sections, updatedInspection], ['seq']) },
            };
        });

        sectionItemMoveForm.current?.close();
    };

    const handleItemEdit = (sectionId: string, itemId: string) => {
        const section = data.inspections.find((section) => section.id === sectionId);
        if (!section) {
            toast.error('Error', { description: 'Section not found.' });
            return;
        }
        // find section item
        const item = section.items.find((item) => item.id === itemId);

        if (!item) {
            toast.error('Error', { description: 'Item not found.' });
            return;
        }

        setInspectionFormSectionData(section);
        setInspectionFormSectionItemData(item);

        setSectionItemFormTitle('Edit Section Item');

        sectionItemForm.current?.open();
    };

    const handleItemRemove = async (sectionId: string, itemId: string) => {
        // find section by sectionId
        const inspection = data.inspections.find((section) => section.id === sectionId);
        if (!inspection) return; // handling if inspection undefinded

        // find section by itemId
        const item = inspection.items.find((item) => item.id === itemId);
        if (!item) return; // handling if item undefinded

        // confirmation
        const confirmation = await confirmDialog.YesNo({
            message: `Are you sure want to remove item ${item.description} from section ${inspection.description}?`,
            ConfirmButtonvariant: 'destructive',
        });
        if (!confirmation) return;

        // create new inspection object
        const newInspection: Inspection = {
            ...inspection,
            items: inspection.items.filter((item) => item.id !== itemId),
        };

        // set state
        setData((prevData) => {
            // remove selected section
            const prevInspections = prevData.inspections.filter((section) => section.id !== sectionId);

            return {
                ...prevData,
                inspections: _.sortBy([...prevInspections, newInspection], ['seq']), // spread with adding new object inspection
            };
        });
    };

    const handleItemMove = async (sectionId: string, itemId: string) => {
        const section = data.inspections.find((section) => section.id === sectionId);
        if (!section) {
            toast.error('Error', { description: 'Section not found.' });
            return;
        }
        // find section item
        const item = section.items.find((item) => item.id === itemId);

        if (!item) {
            toast.error('Error', { description: 'Item not found.' });
            return;
        }

        setInspectionFormSectionData(section);
        setInspectionFormSectionItemMoveData(item);

        sectionItemMoveForm.current?.open();
    };

    return (
        <>
            <Head title="Create Inspection Form" />

            {/* Section */}
            <DialogContainer
                title={sectionFormTitle}
                ref={sectionForm}
                className="min-w-3xl"
                onClose={() => {
                    setInspectionFormSectionData(undefined);
                    setSectionFormTitle('Create Section');
                }}
            >
                <FormSection
                    onSubmit={handleInspectionFormSectionSubmit}
                    inspectionFormSectionData={inspectionFormSectionData}
                    sectionCount={data.inspections.length}
                />
            </DialogContainer>

            {/* Item */}
            <DialogContainer
                title={sectionItemFormTitle}
                ref={sectionItemForm}
                className="min-w-3xl"
                onClose={() => {
                    setInspectionFormSectionData(undefined);
                    setInspectionFormSectionItemData(undefined);
                    setSectionItemFormTitle('Create Section Item');
                }}
            >
                <FormSectionItem
                    onSubmit={handleInspectionFormSectionItemSubmit}
                    inspectionFormSectionData={inspectionFormSectionData}
                    inspectionFormSectionItemData={inspectionFormSectionItemData}
                    itemCount={data.inspections.find((inspection) => inspection.id === inspectionFormSectionData?.id)?.items.length}
                />
            </DialogContainer>

            {/* Item Move */}
            <DialogContainer
                title={'Move Item To Other Section'}
                ref={sectionItemMoveForm}
                className="min-w-3xl"
                onClose={() => {
                    setInspectionFormSectionData(undefined);
                    setInspectionFormSectionItemMoveData(undefined);
                }}
            >
                <FormSectionItemMove
                    onSubmit={handleInspectionFormSectionItemMoveSubmit}
                    inspectionFormSectionData={inspectionFormSectionData}
                    inspectionFormSectionItemData={inspectionFormSectionItemMoveData}
                    itemCount={data.inspections.find((inspection) => inspection.id === inspectionFormSectionItemMoveData?.id)?.items.length}
                    sections={data.inspections}
                />
            </DialogContainer>

            {/* main content */}
            <form onSubmit={submitForm} className="mx-auto w-full p-4">
                <FieldGroup>
                    <FieldSet className="grid grid-cols-2 gap-x-4">
                        <FieldGroup className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>
                                    Code <Label className="text-red-500">*</Label>
                                </FieldLabel>
                                <Input
                                    id="code"
                                    name="code"
                                    type="text"
                                    placeholder="Code"
                                    required
                                    maxLength={50}
                                    onChange={(e) => setData('code', e.target.value)}
                                    value={data.code}
                                    error={errors.code}
                                />
                            </Field>
                            <Field>
                                <FieldLabel>
                                    Name <Label className="text-red-500">*</Label>
                                </FieldLabel>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Name"
                                    required
                                    maxLength={100}
                                    onChange={(e) => setData('name', e.target.value)}
                                    value={data.name}
                                    error={errors.name}
                                />
                            </Field>
                            <Field>
                                <FieldLabel>
                                    Stage <Label className="text-red-500">*</Label>
                                </FieldLabel>
                                <Select
                                    placeholder="Stage"
                                    selectLabel="Select Stage"
                                    value={data.stage ?? null}
                                    onValueChange={(value) => setData('stage', value)}
                                    items={inspectionStages}
                                    error={errors.stage}
                                />
                            </Field>
                            <Field>
                                <FieldLabel>
                                    Publish <Label className="text-red-500">*</Label>
                                </FieldLabel>
                                <Select
                                    placeholder="Select"
                                    selectLabel="Select Publish"
                                    value={data.is_publish ? 'true' : 'false'}
                                    onValueChange={(value) => setData('is_publish', Boolean(value))}
                                    items={[
                                        { value: 'true', label: 'Yes' },
                                        { value: 'false', label: 'No' },
                                    ]}
                                    error={errors.is_publish}
                                />
                            </Field>
                        </FieldGroup>
                        <FieldGroup className="grid grid-cols-3 gap-4">
                            <TooltipWrapper caption={`Estimation Time Arrival`}>
                                <Field>
                                    <FieldLabel>
                                        Use ETA Date <Label className="text-red-500">*</Label>
                                    </FieldLabel>
                                    <Select
                                        placeholder="Select"
                                        selectLabel="Select ETA Date"
                                        value={data.use_eta_dest ? 'true' : 'false'}
                                        onValueChange={(value) => setData('use_eta_dest', Boolean(value))}
                                        items={[
                                            { value: 'true', label: 'Yes' },
                                            { value: 'false', label: 'No' },
                                        ]}
                                        error={errors.use_eta_dest}
                                    />
                                </Field>
                            </TooltipWrapper>
                            <TooltipWrapper caption={`Actual Time Arrival`}>
                                <Field>
                                    <FieldLabel>
                                        Use ATA Date <Label className="text-red-500">*</Label>
                                    </FieldLabel>
                                    <Select
                                        placeholder="Select"
                                        selectLabel="Select ATA Date"
                                        value={data.use_ata_dest ? 'true' : 'false'}
                                        onValueChange={(value) => setData('use_ata_dest', Boolean(value))}
                                        items={[
                                            { value: 'true', label: 'Yes' },
                                            { value: 'false', label: 'No' },
                                        ]}
                                        error={errors.use_ata_dest}
                                    />
                                </Field>
                            </TooltipWrapper>
                            <TooltipWrapper caption={`Time Start & End`}>
                                <Field>
                                    <FieldLabel>
                                        Use Duration <Label className="text-red-500">*</Label>
                                    </FieldLabel>
                                    <Select
                                        placeholder="Select"
                                        selectLabel="Select Duration"
                                        value={data.use_duration ? 'true' : 'false'}
                                        onValueChange={(value) => setData('use_duration', Boolean(value))}
                                        items={[
                                            { value: 'true', label: 'Yes' },
                                            { value: 'false', label: 'No' },
                                        ]}
                                        error={errors.use_duration}
                                    />
                                </Field>
                            </TooltipWrapper>
                        </FieldGroup>
                    </FieldSet>
                </FieldGroup>

                <div className="col-span-12 mt-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="scroll-m-20 text-xl font-semibold tracking-tight">Inspection Items</Label>
                            <div className="flex space-x-2">
                                <Label>Sections : {data.inspections.length}</Label>
                                <Label>Items : {itemCount}</Label>
                            </div>
                        </div>
                        <div className="space-x-2">
                            <TooltipWrapper caption={`Create new section`}>
                                <Button type="button" variant={'normal'} onClick={() => sectionForm.current?.open()}>
                                    <PlusIcon className="size-4" />
                                    <Label className="hidden md:flex">Section</Label>
                                </Button>
                            </TooltipWrapper>
                        </div>
                    </div>

                    <div className="my-2 w-full">
                        <ScrollArea className="h-[calc(100vh-26rem)] rounded-sm border p-2 pe-4 shadow">
                            {data.inspections.length <= 0 ? (
                                <div className="w-full items-center text-center">
                                    <Label>No data found, please add section and item.</Label>
                                </div>
                            ) : (
                                data.inspections.map((section) => {
                                    return (
                                        <Fragment key={section.id}>
                                            <div className="mb-5">
                                                <div className="mb-3 flex items-end justify-between">
                                                    <div className="flex flex-col gap-1">
                                                        <Label className="text-md scroll-m-20 font-semibold tracking-tight">
                                                            {section.description}
                                                        </Label>
                                                        <div className="flex space-x-2">
                                                            <TooltipWrapper caption={`Order: ${section.seq}`}>
                                                                <Badge variant={'outline'}>{section.seq}</Badge>
                                                            </TooltipWrapper>
                                                            <Badge variant={'outline'}>
                                                                {section.is_separate_page ? 'Separate Page' : 'Same Page'}
                                                            </Badge>
                                                            <Badge variant={'outline'}>
                                                                {section.items.length} {section.items.length > 0 ? 'Items' : 'Item'}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="space-x-2">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button type="button" variant={'default'}>
                                                                    <MenuIcon className="size-4" />
                                                                    Section
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent>
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onClick={() => handleSectionEdit(section.id)}>
                                                                    <EditIcon className="size-4" /> Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleSectionRemove(section)}>
                                                                    <XIcon className="size-4" /> Remove
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                        <TooltipWrapper caption={`Create new item`}>
                                                            <Button
                                                                type="button"
                                                                variant={'outline'}
                                                                onClick={() => handleSectionItemCreate(section)}
                                                            >
                                                                <PlusIcon className="size-4" />
                                                                Item
                                                            </Button>
                                                        </TooltipWrapper>
                                                    </div>
                                                </div>
                                                <div className="rounded-sm border">
                                                    <ScrollArea className="h-80 w-full">
                                                        <Table>
                                                            <TableHeader className="sticky top-0 z-10 table-fixed shadow-sm backdrop-blur-sm">
                                                                <TableRow>
                                                                    <TableHead className="w-auto">Description</TableHead>
                                                                    <TableHead className="w-25">Type</TableHead>
                                                                    <TableHead className="w-25 text-center">Seq / Order</TableHead>
                                                                    <TableHead className="w-10"></TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {section.items.length <= 0 ? (
                                                                    <TableRow className="w-full text-center">
                                                                        <TableCell colSpan={3}>Item not found.</TableCell>
                                                                    </TableRow>
                                                                ) : (
                                                                    section.items.map((item) => (
                                                                        <TableRow key={item.id}>
                                                                            <TableCell>{item.description}</TableCell>
                                                                            <TableCell>{item.item_type.replaceAll('_', ' + ')}</TableCell>
                                                                            <TableCell className="text-center">{item.seq}</TableCell>
                                                                            <TableCell className="text-right">
                                                                                <DropdownMenu>
                                                                                    <DropdownMenuTrigger asChild>
                                                                                        <Button type="button" variant={'default'} size={'icon'}>
                                                                                            <MenuIcon className="size-4" />
                                                                                        </Button>
                                                                                    </DropdownMenuTrigger>
                                                                                    <DropdownMenuContent>
                                                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                                        <DropdownMenuSeparator />
                                                                                        <DropdownMenuItem
                                                                                            onClick={() => handleItemEdit(section.id, item.id)}
                                                                                        >
                                                                                            <EditIcon className="size-4" /> Edit
                                                                                        </DropdownMenuItem>
                                                                                        <DropdownMenuItem
                                                                                            onClick={() => handleItemRemove(section.id, item.id)}
                                                                                        >
                                                                                            <XIcon className="size-4" /> Remove
                                                                                        </DropdownMenuItem>
                                                                                        <DropdownMenuItem
                                                                                            onClick={() => handleItemMove(section.id, item.id)}
                                                                                        >
                                                                                            <ArrowLeftRight className="size-4" /> Move
                                                                                        </DropdownMenuItem>
                                                                                    </DropdownMenuContent>
                                                                                </DropdownMenu>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                    </ScrollArea>
                                                </div>
                                            </div>
                                        </Fragment>
                                    );
                                })
                            )}
                        </ScrollArea>
                    </div>

                    <div className="flex items-start justify-between">
                        <Button type="button" disabled={processing} variant={'warning'} onClick={handleCancel}>
                            <XIcon className="size-4" />
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} variant={'success'}>
                            {processing ? <Loader2 className="size-4 animate-spin" /> : <CheckIcon className="size-4" />}
                            Submit
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
};

Create.breadcrumbs = breadcrumbsData;
export default Create;
