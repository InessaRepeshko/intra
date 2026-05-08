import { cn } from '@shared/lib/utils/cn';

const colorClasses = [
<<<<<<< HEAD
    'bg-rose-100 text-rose-800 border-rose-200',
    'bg-orange-100 text-orange-800 border-orange-200',
    'bg-green-100 text-green-800 border-green-200',
    'bg-cyan-100 text-cyan-800 border-cyan-200',
    'bg-purple-100 text-purple-800 border-purple-200',
];

const predefinedColors: Record<string, string> = {
    beginner: 'bg-rose-100 text-rose-800 border-rose-200',
    novice: 'bg-orange-100 text-orange-800 border-orange-200',
    intermediate: 'bg-green-100 text-green-800 border-green-200',
    advanced: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    expert: 'bg-purple-100 text-purple-800 border-purple-200',
};

export function getColorForLabel(str: string): string {
    const normalizedStr = str.toLowerCase().trim();
    if (predefinedColors[normalizedStr]) {
        return predefinedColors[normalizedStr];
    }

=======
    'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
    'bg-amber-100 text-amber-800 border-amber-200',
    'bg-green-100 text-green-800 border-green-200',
    'bg-sky-100 text-sky-800 border-sky-200',
    'bg-violet-100 text-violet-800 border-violet-200',
];

export function getHashColor(str: string): string {
>>>>>>> main
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

<<<<<<< HEAD
    const colorClass = getColorForLabel(label);
=======
    const colorClass = getHashColor(label);
>>>>>>> main

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
