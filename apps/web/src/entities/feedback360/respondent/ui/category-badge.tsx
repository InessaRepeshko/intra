import { cn } from '@shared/lib/utils/cn';
import { RespondentCategory } from '../model/types';

export const categoryConfig: Record<
    RespondentCategory,
    { label: string; className: string }
> = {
    [RespondentCategory.SELF_ASSESSMENT]: {
        label: 'Self-assessment',
        className: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    [RespondentCategory.TEAM]: {
        label: 'Team',
        className: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    [RespondentCategory.OTHER]: {
        label: 'Other',
        className: 'bg-violet-100 text-violet-800 border-violet-200',
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
