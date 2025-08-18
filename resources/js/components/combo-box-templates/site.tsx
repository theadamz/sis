import { type SiteOption } from '@/types';
import { ReactNode } from 'react';
import { Label } from '../ui/label';

export function ComboBoxSiteOption(item: SiteOption): ReactNode {
    return (
        <div className="my-1 grid w-full justify-items-start">
            <Label className="font-bold">{item.name}</Label>
            <div className="mt-2">
                <Label>
                    {item.entity.code} - {item.entity.name}
                </Label>
            </div>
        </div>
    );
}

export function ComboBoxSiteOptionSelected(item: SiteOption): ReactNode {
    return (
        <div className="grid justify-items-start">
            <Label>{item.name}</Label>
        </div>
    );
}

export function ComboBoxSiteOptionSelectedMulti(item: SiteOption): ReactNode {
    return (
        <div className="me-2 grid justify-items-start rounded-sm border p-2 shadow-sm">
            <Label>{item.name}</Label>
        </div>
    );
}
