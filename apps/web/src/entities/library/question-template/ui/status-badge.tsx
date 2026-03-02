import { QuestionTemplateStatus } from '@entities/library/question-template/model/types';
import { cn } from '@shared/lib/utils/cn';

export const statusConfig: Record<
    QuestionTemplateStatus,
    { label: string; className: string }
> = {
    [QuestionTemplateStatus.ACTIVE]: {
        label: 'Active',
        className: 'bg-green-100 text-green-800 border-green-200',
    },
    [QuestionTemplateStatus.ARCHIVE]: {
        label: 'Archived',
        className: 'bg-gray-100 text-gray-600 border-gray-200',
    },
};

export function StatusBadge({ status }: { status: QuestionTemplateStatus }) {
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
