import { cn } from '@shared/lib/utils/cn';
import { ResponseStatus } from '../model/types';

export const responseStatusConfig: Record<
    ResponseStatus,
    { label: string; className: string }
> = {
    [ResponseStatus.PENDING]: {
        label: 'Pending',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    [ResponseStatus.IN_PROGRESS]: {
        label: 'In Progress',
        className: 'bg-orange-100 text-orange-800 border-orange-200',
    },
    [ResponseStatus.COMPLETED]: {
        label: 'Completed',
        className: 'bg-green-100 text-green-800 border-green-200',
    },
    [ResponseStatus.CANCELED]: {
        label: 'Cancelled',
        className: 'bg-red-100 text-red-800 border-red-200',
    },
};

export function ResponseStatusBadge({ status }: { status: ResponseStatus }) {
    const config = responseStatusConfig[status];

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
