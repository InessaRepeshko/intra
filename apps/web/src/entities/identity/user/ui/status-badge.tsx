import { IdentityStatus } from '@entities/identity/user/model/types';
import { cn } from '@shared/lib/utils/cn';

export const statusConfig: Record<
    IdentityStatus,
    { label: string; className: string }
> = {
    [IdentityStatus.ACTIVE]: {
        label: 'Active',
        className: 'bg-green-100 text-green-800 border-green-200',
    },
    [IdentityStatus.INACTIVE]: {
        label: 'Inactive',
        className: 'bg-gray-100 text-gray-600 border-gray-200',
    },
};

export function StatusBadge({ status }: { status: IdentityStatus }) {
    const config = statusConfig[status];

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                config.className,
            )}
        >
            {config.label}
        </span>
    );
}
