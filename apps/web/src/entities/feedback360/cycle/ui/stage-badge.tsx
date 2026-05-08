import { CycleStage } from '@entities/feedback360/cycle/model/types';
import { cn } from '@shared/lib/utils/cn';

export const stageConfig: Record<
    CycleStage,
    { label: string; className: string }
> = {
    [CycleStage.NEW]: {
        label: 'New',
        className: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    [CycleStage.ACTIVE]: {
        label: 'Active',
        className: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    [CycleStage.FINISHED]: {
        label: 'Finished',
        className: 'bg-green-100 text-green-800 border-green-200',
    },
    [CycleStage.ARCHIVED]: {
        label: 'Archived',
        className: 'bg-gray-100 text-gray-600 border-gray-200',
    },
    [CycleStage.CANCELED]: {
        label: 'Canceled',
        className: 'bg-red-100 text-red-800 border-red-200',
    },
};

export function StageBadge({ stage }: { stage: CycleStage }) {
    const config = stageConfig[stage];

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
