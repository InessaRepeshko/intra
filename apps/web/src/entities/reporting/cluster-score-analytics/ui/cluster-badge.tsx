import { cn } from '@shared/lib/utils/cn';

const colorClasses = [
    'bg-rose-100 text-rose-800 border-rose-200',
    'bg-orange-100 text-orange-800 border-orange-200',
    'bg-green-100 text-green-800 border-green-200',
    'bg-cyan-100 text-cyan-800 border-cyan-200',
    'bg-purple-100 text-purple-800 border-purple-200',
];

export const predefinedColors: Record<string, string> = {
    beginner: 'bg-rose-100 border-rose-200 text-rose-800',
    novice: 'bg-orange-100 border-orange-200 text-orange-800',
    intermediate: 'bg-green-100 border-green-200 text-green-800',
    advanced: 'bg-cyan-100 border-cyan-200 text-cyan-800',
    expert: 'bg-purple-100 border-purple-200 text-purple-800',
};

export function getColorForLabel(str: string): string {
    const normalizedStr = str.toLowerCase().trim();
    if (predefinedColors[normalizedStr]) {
        return predefinedColors[normalizedStr];
    }

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colorClasses.length;
    return colorClasses[index];
}

interface ClusterBadgeProps {
    label: string | undefined | null;
    className?: string;
}

export function ClusterBadge({ label, className }: ClusterBadgeProps) {
    if (!label) return null;

    const colorClass = getColorForLabel(label);

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                colorClass,
                className,
            )}
        >
            {label}
        </span>
    );
}
