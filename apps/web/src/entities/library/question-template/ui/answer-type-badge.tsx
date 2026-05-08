import { AnswerType } from '@entities/library/question-template/model/types';
import { cn } from '@shared/lib/utils/cn';

export const answerTypeConfig: Record<
    AnswerType,
    { label: string; className: string }
> = {
    [AnswerType.NUMERICAL_SCALE]: {
        label: 'Numerical',
        className: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    },
    [AnswerType.TEXT_FIELD]: {
        label: 'Text',
        className: 'bg-purple-100 text-purple-800 border-purple-200',
    },
};

export function AnswerTypeBadge({ answerType }: { answerType: AnswerType }) {
    const config = answerTypeConfig[answerType];

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
