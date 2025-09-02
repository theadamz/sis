import { confirmDialog } from '@/components/confirm-dialog';
import DialogContainer, { DialogContainerRef } from '@/components/dialog-container';
import { errorDialog } from '@/components/error-dialog';
import Select from '@/components/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { refactorErrorMessage } from '@/lib/refactorMessages';
import { type BreadcrumbItem, type InspectionFormItem, type InspectionFormSection, type InspectionType, type SharedData } from '@/types';
import { getInspectionStage, InspectionFlow, InspectionStage } from '@/types/enum';
import { Head, useForm } from '@inertiajs/react';
import _ from 'lodash';
import { CheckIcon, EditIcon, Loader2, MenuIcon, PlusIcon, XIcon } from 'lucide-react';
import { FormEventHandler, Fragment, ReactNode, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import FormSection from './form-section';
import FormSectionItem from './form-section-item';

const breadcrumbsData: BreadcrumbItem[] = [
    {
        title: 'Config',
    },
    {
        title: 'Inspection',
    },
    {
        title: 'Form',
        href: route('config.inspection.form.index'),
    },
    {
        title: 'Edit',
    },
];

type Inspection = InspectionFormSection & {
    items: InspectionFormItem[];
};

type InspectionForm = {
    id: string;
    flow: InspectionFlow;
    inspection_type: string;
    code: string;
    name: string;
    use_eta_dest: boolean;
    use_ata_dest: boolean;
    is_publish: boolean;
    required_stages: string[];
    inspections: Inspection[];
};

const stages = Object.values(InspectionStage);

interface CreateProps {
    inspectionTypes: InspectionType[];
    data2edit: InspectionForm;
}

const Create = ({ inspectionTypes, data2edit }: CreateProps): ReactNode => {
    /*** inertia js ***/
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm<Required<InspectionForm>>({
        id: data2edit.id,
        flow: data2edit.flow,
        inspection_type: data2edit.inspection_type,
        code: data2edit.code,
        name: data2edit.name,
        use_eta_dest: data2edit.use_eta_dest,
        use_ata_dest: data2edit.use_ata_dest,
        is_publish: data2edit.is_publish,
        required_stages: data2edit.required_stages,
        inspections: data2edit.inspections,
    });

    /*** references ***/
    const sectionForm = useRef<DialogContainerRef>(null);
    const sectionItemForm = useRef<DialogContainerRef>(null);

    /*** states ***/
    const [sectionFormTitle, setSectionFormTitle] = useState<string>('Create Section');
    const [sectionItemFormTitle, setSectionItemFormTitle] = useState<string>('Create Section Item');
    const [itemCount, setItemCount] = useState<number>(0);
    const [inspectionFormSectionData, setInspectionFormSectionData] = useState<InspectionFormSection>();
    const [inspectionFormSectionItemData, setInspectionFormSectionItemData] = useState<InspectionFormItem>();

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
    const submitForm: FormEventHandler = async (e: React.FormEvent<Element>) => {
        e.preventDefault();

        put(route('config.inspection.form.update', { id: data2edit.id }), {
            onSuccess: async (response) => {
                const props = response.props as unknown as SharedData;
                const flash = props.flash;
                if (flash.toast) toast.success(flash.toast.title, { description: flash.toast.message });
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
            flow: InspectionFlow.IN,
            inspection_type: '',
            code: '',
            name: '',
            use_eta_dest: false,
            use_ata_dest: false,
            is_publish: true,
            required_stages: [InspectionStage.CHECKED_IN, InspectionStage.LOADING, InspectionStage.CHECKED_OUT],
            inspections: [],
        });
        setSectionFormTitle('Create Section');
        setSectionItemFormTitle('Create Section Item');
        setItemCount(0);
        setInspectionFormSectionData(undefined);
        setInspectionFormSectionItemData(undefined);
    };

    const handleStageChange = (checked: boolean, value: InspectionStage) => {
        if (!checked) {
            setData((prevData) => {
                return {
                    ...prevData,
                    required_stages: prevData.required_stages.filter((item) => value !== item),
                };
            });
        } else {
            setData((prevData) => {
                return {
                    ...prevData,
                    ...{ required_stages: [...prevData.required_stages, value] },
                };
            });
        }
    };

    const handleStageSort = (element: Inspection) => {
        return _.indexOf(stages, element.stage);
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
                    ...{ inspections: _.sortBy([...inspections, updatedInspection], [handleStageSort, 'seq']) },
                };
            });
        } else {
            const inspection: Inspection = {
                ...inspectionFormSection,
                id: window.crypto.randomUUID(),
                inspection_form_id: window.crypto.randomUUID(),
                items: [],
            };

            // merge inspection with sort
            setData((prevData) => {
                return {
                    ...prevData,
                    ...{ inspections: _.sortBy([...prevData.inspections, inspection], [handleStageSort, 'seq']) },
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
                    [handleStageSort, 'seq'],
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
                const sections = prevData.inspections.filter((section) => section.id !== inspectionFormSectionItem.inspection_form_section_id);

                // get previous section with seelcted data
                const prevSection = prevData.inspections.find((item) => item.id === inspectionFormSectionItem.inspection_form_section_id);
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
                    ...{ inspections: _.sortBy([...sections, updatedInspection], [handleStageSort, 'seq']) },
                };
            });
        } else {
            setData((prevData) => {
                // get previous data without selected data
                const inspections = prevData.inspections.filter((item) => item.id !== inspectionFormSectionItem.inspection_form_section_id);

                // get previous data and replace values
                const prevInspection = prevData.inspections.find((item) => item.id === inspectionFormSectionItem.inspection_form_section_id);

                // if prevInspection is undefined
                if (!prevInspection) return prevData;

                // set id
                inspectionFormSectionItem.id = window.crypto.randomUUID();

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
                    ...{ inspections: _.sortBy([...inspections, updatedInspection], [handleStageSort, 'seq']) },
                };
            });
        }

        sectionItemForm.current?.close();
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

    return (
        <>
            <Head title="Edit Inspection Form" />

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

            {/* main content */}
            <form onSubmit={submitForm} className="mx-auto w-full p-4">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-2 grid gap-2">
                        <Label htmlFor="inspection_type">
                            Flow <Label className="text-red-500">*</Label>
                        </Label>
                        <Select
                            className="w-full"
                            placeholder="Flow"
                            selectLabel="Flow"
                            value={data.flow ? data.flow : ''}
                            onValueChange={(value) => setData('flow', value as InspectionFlow)}
                            items={Object.entries(InspectionFlow).map(([label, value]) => {
                                return { value: value, label: label };
                            })}
                        />
                    </div>
                    <div className="col-span-2 grid gap-2">
                        <Label htmlFor="inspection_type">
                            Inspection Type <Label className="text-red-500">*</Label>
                        </Label>
                        <Select
                            className="w-full"
                            placeholder="Inspection Type"
                            selectLabel="Inspection Type"
                            value={data.inspection_type ? data.inspection_type : ''}
                            onValueChange={(value) => setData('inspection_type', value)}
                            items={inspectionTypes.map((item) => {
                                return { value: item.id, label: item.name };
                            })}
                        />
                    </div>
                    <div className="col-span-4 grid gap-2">
                        <Label htmlFor="code">
                            Code <Label className="text-red-500">*</Label>
                        </Label>
                        <Input
                            id="code"
                            name="code"
                            type="text"
                            placeholder="Code"
                            required
                            onChange={(e) => setData('code', e.target.value)}
                            value={data.code}
                            error={errors.code}
                        />
                    </div>
                    <div className="col-span-4 grid gap-2">
                        <Label htmlFor="name">
                            Name <Label className="text-red-500">*</Label>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Name"
                            required
                            onChange={(e) => setData('name', e.target.value)}
                            value={data.name}
                            error={errors.name}
                        />
                    </div>
                    <div className="col-span-2 grid gap-2">
                        <Label htmlFor="use_eta_dest">Use Estimation Time Arrival (ETA Date)</Label>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="use_eta_dest"
                                name="use_eta_dest"
                                defaultChecked={data.use_eta_dest}
                                checked={data.use_eta_dest}
                                onCheckedChange={(e) => setData('use_eta_dest', e.valueOf() as boolean)}
                            />
                            <Label htmlFor="use_eta_dest" className="text-muted-foreground text-sm">
                                Yes
                            </Label>
                        </div>
                    </div>
                    <div className="col-span-2 grid gap-2">
                        <Label htmlFor="use_ata_dest">Use Actual Time Arrival (ATA Date)</Label>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="use_ata_dest"
                                name="use_ata_dest"
                                defaultChecked={data.use_ata_dest}
                                checked={data.use_ata_dest}
                                onCheckedChange={(e) => setData('use_ata_dest', e.valueOf() as boolean)}
                            />
                            <Label htmlFor="use_ata_dest" className="text-muted-foreground text-sm">
                                Yes
                            </Label>
                        </div>
                    </div>
                    <div className="col-span-4 grid gap-2">
                        <Label htmlFor="is_publish">
                            Stages <Label className="text-red-500">*</Label>
                        </Label>
                        <div className="flex items-center space-x-2">
                            {Object.entries(InspectionStage).map(([label, value]) => {
                                return (
                                    <div className="flex items-center justify-around" key={value}>
                                        <Checkbox
                                            className="mr-1"
                                            id={`stage_check_${value}`}
                                            name={`stage_check_${value}`}
                                            defaultChecked={data.required_stages.includes(value)}
                                            checked={data.required_stages.includes(value)}
                                            onCheckedChange={(e) => handleStageChange(e.valueOf() as boolean, value)}
                                        />
                                        <Label htmlFor={`stage_check_${value}`} className="text-muted-foreground mr-2 text-sm">
                                            {label.replace('_', ' ')}
                                        </Label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="col-span-4 grid gap-2">
                        <Label htmlFor="is_publish">Publish</Label>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_publish"
                                name="is_publish"
                                defaultChecked={data.is_publish}
                                checked={data.is_publish}
                                onCheckedChange={(e) => setData('is_publish', e.valueOf() as boolean)}
                            />
                            <Label htmlFor="is_publish" className="text-muted-foreground text-sm">
                                Yes
                            </Label>
                        </div>
                    </div>
                </div>
                <div className="col-span-12 mt-5 grid gap-2">
                    <div className="flex items-center justify-between">
                        <Label className="scroll-m-20 text-xl font-semibold tracking-tight">Inspection Items</Label>
                        <div className="space-x-2">
                            <Button type="button" variant={'normal'} onClick={() => sectionForm.current?.open()}>
                                <PlusIcon className="size-4" />
                                <Label className="hidden md:flex">Section</Label>
                            </Button>
                        </div>
                    </div>

                    <div className="w-full">
                        <ScrollArea className="h-[calc(100vh-24.9rem)] rounded-sm border p-2 pe-4 shadow">
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
                                                            <Badge variant={getInspectionStage(section.stage, 'variant') as any}>
                                                                {getInspectionStage(section.stage, 'label')}
                                                            </Badge>
                                                            <Badge variant={'outline'}>{section.seq}</Badge>
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
                                                        <Button type="button" variant={'outline'} onClick={() => handleSectionItemCreate(section)}>
                                                            <PlusIcon className="size-4" />
                                                            Item
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="rounded-sm border">
                                                    <ScrollArea className="h-[20rem] w-full">
                                                        <Table>
                                                            <TableHeader className="sticky top-0 z-10 table-fixed shadow-sm backdrop-blur-sm">
                                                                <TableRow>
                                                                    <TableHead className="w-auto">Description</TableHead>
                                                                    <TableHead className="w-[100px]">Type</TableHead>
                                                                    <TableHead className="w-[100px] text-center">Seq / Order</TableHead>
                                                                    <TableHead className="w-[40px]"></TableHead>
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
                                                                            <TableCell>{item.type}</TableCell>
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
                        <div className="flex">
                            <Label className="me-5">Sections : {data.inspections.length}</Label>
                            <Label>Items : {itemCount}</Label>
                        </div>
                        <Button type="submit" disabled={processing} variant={'success'}>
                            {processing ? <Loader2 className="mr-2 size-4 animate-spin" /> : <CheckIcon className="mr-2 size-4" />}
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
