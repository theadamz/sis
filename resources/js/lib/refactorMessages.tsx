import { ReactNode } from 'react';

export const refactorErrorMessage = (errors: { [key: string]: string }): string | ReactNode => {
    return Object.entries(errors).map(([key, value]) => {
        return (
            <span className="flex" key={key}>
                {key}: {value}
            </span>
        );
    });
};
