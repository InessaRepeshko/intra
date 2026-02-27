import { cn } from '@shared/lib/utils/cn';
import { RespondentCategory } from '../model/types';

export const categoryConfig: Record<
    RespondentCategory,
    { label: string; className: string }
> = {
    [RespondentCategory.SELF_ASSESSMENT]: {
        label: 'Self-assessment',
        className: 'bg-lime-100 text-lime-800 border-lime-200',
    },
    [RespondentCategory.TEAM]: {
        label: 'Team',
        className: 'bg-sky-100 text-sky-800 border-sky-200',
    },
    [RespondentCategory.OTHER]: {
        label: 'Other',
        className: 'bg-teal-100 text-teal-800 border-teal-200',
    },
};

export function CategoryBadge({ category }: { category: RespondentCategory }) {
    const config = categoryConfig[category];

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
