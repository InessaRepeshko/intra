import { ReviewStage } from '@entities/feedback360/review/model/types';
import { cn } from '@shared/lib/utils/cn';

export const stageConfig: Record<
    ReviewStage,
    { label: string; className: string }
> = {
    [ReviewStage.CANCELED]: {
        label: 'Canceled',
        className: 'bg-red-100 text-red-800 border-red-200',
    },
    [ReviewStage.NEW]: {
        label: 'New',
        className: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    [ReviewStage.SELF_ASSESSMENT]: {
        label: 'Self-assessment',
        className: 'bg-teal-100 text-teal-800 border-teal-200',
    },
    [ReviewStage.WAITING_TO_START]: {
        label: 'Waiting to start',
        className: 'bg-orange-100 text-orange-800 border-orange-200',
    },
    [ReviewStage.IN_PROGRESS]: {
        label: 'In progress',
        className: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    [ReviewStage.FINISHED]: {
        label: 'Finished',
        className: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
    },
    [ReviewStage.PREPARING_REPORT]: {
        label: 'Report generated',
        className: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
    },
    [ReviewStage.PROCESSING_BY_HR]: {
        label: 'Processing by HR',
        className: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    [ReviewStage.PUBLISHED]: {
        label: 'Published',
        className: 'bg-lime-100 text-lime-800 border-lime-200',
    },
    [ReviewStage.ANALYSIS]: {
        label: 'Analysis',
        className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    [ReviewStage.ARCHIVED]: {
        label: 'Archived',
        className: 'bg-green-100 text-green-800 border-green-200',
    },
};

export function StageBadge({ stage }: { stage: ReviewStage }) {
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
