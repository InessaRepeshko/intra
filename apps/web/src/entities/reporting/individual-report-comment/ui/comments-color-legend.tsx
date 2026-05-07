import { cn } from '@shared/lib/utils/cn';

const LEGEND_CELLS: { label: string; className: string }[] = [
    { label: '1 comment', className: '' },
    { label: '2 comments', className: 'bg-green-100' },
    { label: '3 comments', className: 'bg-green-200' },
    { label: '4 and more comments', className: 'bg-green-300' },
];

export function CommentsColorLegend() {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">
                Colors gradation:
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-md border bg-border">
                {LEGEND_CELLS.map((cell) => (
                    <div
                        key={cell.label}
                        className={cn(
                            'px-3 py-2 text-sm text-foreground bg-card',
                            cell.className,
                        )}
                    >
                        {cell.label}
                    </div>
                ))}
            </div>
        </div>
    );
}
