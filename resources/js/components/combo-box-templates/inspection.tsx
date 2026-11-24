import type { InspectionFormOption } from '@/types';
import { ReactNode } from 'react';
import { Label } from '../ui/label';

export function ComboBoxInspectionFormOption(item: InspectionFormOption): ReactNode {
    return (
        <div className="my-1 grid w-full justify-items-start">
            <Label className="font-bold">{item.name}</Label>
            <div className="mt-2">
                <Label>{item.code}</Label>
            </div>
        </div>
    );
}

export function ComboBoxInspectionFormOptionSelected(item: InspectionFormOption): ReactNode {
    return (
        <div className="grid justify-items-start">
            <Label>{item.name}</Label>
        </div>
    );
}
