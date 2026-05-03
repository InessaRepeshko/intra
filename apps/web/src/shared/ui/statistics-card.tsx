import { Card } from '@shared/components/ui/card';
import { cn } from '@shared/lib/utils/cn';

export function StatisticsCard({
    title,
    value,
    icon: Icon,
    width,
    color,
}: {
    title: string;
    value: string | null | undefined;
    icon?: React.ElementType;
    width?: number;
    color?: string;
}) {
    if (!title || title === null) {
        return <span className="text-muted-foreground">None</span>;
    }

    return (
        <Card
            className="flex flex-row flex-wrap items-center text-center sm:text-left justify-center gap-3 p-4 w-full overflow-hidden"
            style={{ maxWidth: width ? `${width}px` : '300px' }}
        >
            <div className="flex flex-wrap flex-col flex-1 gap-1 min-w-fit justify-start items-start sm:gap-2 m-auto">
                <span className="break-all text-muted-foreground text-sm">
                    {title}
                </span>
                <span className="font-medium text-4xl text-foreground">
                    {value}
                </span>
            </div>
            <div className="flex h-20 w-20 p-0 m-0 bg-neutral-400/5 border-1 border-foreground/10 rounded-xl items-center justify-center">
                {Icon && (
                    <Icon
                        className={cn(
                            'shrink-0 h-1/2 w-1/2',
                            color ? color : 'text-muted-foreground',
                        )}
                    />
                )}
            </div>
        </Card>
    );
}
