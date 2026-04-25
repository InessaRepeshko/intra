import { Card } from '@shared/components/ui/card';

interface CycleStatsCardProps {
    title: string;
    numericValue?: string;
    icon?: React.ElementType;
    textColor?: string;
}

export function CycleStatsCard({
    title,
    numericValue,
    icon: Icon,
    textColor,
}: CycleStatsCardProps) {
    if (!title || title === null) {
        return <span className="text-muted-foreground">None</span>;
    }

    return (
        <Card className="flex flex-row flex-wrap items-center text-center sm:text-left justify-center gap-3 p-4 w-full max-w-[220px] overflow-hidden">
            <div className="flex flex-wrap flex-col flex-1 gap-1 min-w-0 justify-start items-start sm:gap-2 m-auto">
                <span className="break-words text-muted-foreground text-sm">
                    {title ?? 'None'}
                </span>
                {numericValue && (
                    <span className="font-medium text-4xl text-foreground">
                        {numericValue}
                    </span>
                )}
            </div>
            <div className="flex h-20 w-20 p-0 m-0 bg-neutral-400/5 border-1 border-foreground-500/10 rounded-xl items-center justify-center">
                {Icon && (
                    <Icon
                        className={`shrink-0 h-1/2 w-1/2 ${textColor ?? 'text-muted-foreground'}`}
                    />
                )}
            </div>
        </Card>
    );
}
