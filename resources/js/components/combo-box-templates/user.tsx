import { type UserOption } from '@/types';
import { ReactNode } from 'react';
import { Label } from '../ui/label';

export function ComboBoxUserOption(item: UserOption): ReactNode {
    return (
        <div className="my-1 grid w-full justify-items-start">
            <Label className="font-bold">{item.name}</Label>
            <div className="mt-2">
                <Label>{item.email}</Label>
            </div>
        </div>
    );
}

export function ComboBoxUserOptionSelected(item: UserOption): ReactNode {
    return (
        <div className="grid w-full justify-items-start">
            <Label className="font-bold">{item.name}</Label>
            <div className="mt-1">
                <Label>{item.email}</Label>
            </div>
        </div>
    );
}

export function ComboBoxUserInlineOptionSelected(item: UserOption): ReactNode {
    return (
        <div className="grid w-full justify-items-start">
            <Label>
                {item.name} <Label className="me-1">|</Label>
                <Label>{item.email}</Label>
            </Label>
        </div>
    );
}
