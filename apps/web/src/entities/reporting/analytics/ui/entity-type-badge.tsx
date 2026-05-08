import { EntityType } from '@entities/reporting/analytics/model/types';
import { cn } from '@shared/lib/utils/cn';

export const entityTypeConfig: Record<
    EntityType,
    { label: string; className: string }
> = {
    [EntityType.QUESTION]: {
        label: 'Question',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    [EntityType.COMPETENCE]: {
        label: 'Competence',
        className: 'bg-pink-100 text-pink-800 border-pink-200',
    },
};

export function EntityTypeBadge({ entityType }: { entityType: EntityType }) {
    const config = entityTypeConfig[entityType];

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
