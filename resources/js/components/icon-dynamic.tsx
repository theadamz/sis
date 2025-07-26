import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { lazy, Suspense } from 'react';

const fallback = <div style={{ background: '#ddd', width: 16, height: 16 }} />;

interface IconDynamicProps extends Omit<LucideProps, 'ref'> {
    name: keyof typeof dynamicIconImports | string;
}

const IconDynamic = ({ name, ...props }: IconDynamicProps) => {
    const LucideIcon = name in dynamicIconImports ? lazy(dynamicIconImports[name as keyof typeof dynamicIconImports]) : () => fallback;

    return (
        <Suspense fallback={fallback}>
            <LucideIcon {...props} />
        </Suspense>
    );
};

export default IconDynamic;
