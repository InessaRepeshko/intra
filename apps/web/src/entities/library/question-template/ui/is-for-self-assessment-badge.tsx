import { ForSelfassessmentType } from '@entities/library/question-template/model/types';
import { cn } from '@shared/lib/utils/cn';
import { Check, X } from 'lucide-react';

export const forSelfAssessmentConfig: Record<
    ForSelfassessmentType,
    { label: string; icon: React.ReactNode; className: string }
> = {
    [ForSelfassessmentType.TRUE]: {
        label: `For self-assessment`,
        icon: <Check />,
        className: 'bg-green-100 text-green-800 border-green-200',
    },
    [ForSelfassessmentType.FALSE]: {
        label: `Not for self-assessment`,
        icon: <X />,
        className: 'bg-red-100 text-red-800 border-red-200',
    },
};

export function ForSelfAssessmentBadge({
    forSelfassessment,
}: {
    forSelfassessment: ForSelfassessmentType;
}) {
    const config = forSelfAssessmentConfig[forSelfassessment];

    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 text-xs font-semibold',
            )}
        >
            <span className={cn(config.className, 'rounded-lg border')}>
                {config.icon}
            </span>
            {/* <span className="ml-1">{config.label}</span> */}
        </span>
    );
}
