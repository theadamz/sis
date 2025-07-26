import { ArrowDownIcon, ArrowDownUpIcon, ArrowUpIcon } from 'lucide-react';
import { JSX } from 'react';

type CaretColumnProps = {
    sort: boolean | string;
};

export default function CaretColumn(props: Readonly<CaretColumnProps>): JSX.Element {
    if (!props.sort) {
        return <ArrowDownUpIcon className="ml-2 h-4 w-4" />;
    }

    return props.sort === 'asc' ? <ArrowUpIcon className="ml-2 h-4 w-4" /> : <ArrowDownIcon className="ml-2 h-4 w-4" />;
}
