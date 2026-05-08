import { Card } from '@shared/components/ui/card';
import { formatNumber } from '@shared/lib/utils/format-number';
import { Percent } from 'lucide-react';

interface CompetenceInsightCardProps {
    num: number | null | undefined;
    id: number | null | undefined;
    title: string | null | undefined;
    averageRating: number;
    averageDelta: number;
    averagePercentage: number;
}

export function CompetenceInsightCard({
    competenceTitle,
    competenceRating,
    insightTitle,
    icon: Icon,
    textColor,
}: {
    competenceTitle: string | null | undefined;
    competenceRating: number | null | undefined;
    insightTitle?: string;
    icon?: React.ElementType;
    textColor?: string;
}) {
    if (!competenceTitle || competenceTitle === null) {
        return <span className="text-muted-foreground">None</span>;
    }

    return (
        <Card className="flex flex-row flex-wrap items-start text-center sm:text-left justify-center gap-3 p-4 w-full max-w-[400px] overflow-hidden">
            <div className="flex h-20 w-20 p-0 m-0 bg-neutral-500/5 border-1 border-foreground-500/10 rounded-xl items-center justify-center">
                {Icon && (
                    <Icon
                        className={`shrink-0 h-1/2 w-1/2 ${textColor ?? 'text-muted-foreground'}`}
                    />
                )}
            </div>
            <div className="flex flex-wrap gap-4 min-w-0 justify-between items-start m-auto sm:gap-2">
                <div
                    className={`flex flex-wrap flex-col items-center justify-start gap-1.5 text-base w-full text-foreground`}
                >
                    <div className="flex flex-row items-center gap-1">
                        <span className="font-medium break-words">
                            {competenceTitle ?? 'None'}
                        </span>
                    </div>
                    {competenceRating && (
                        <div className="flex flex-row items-center gap-1 text-sm">
                            <span className="flex items-center gap-1">
                                <span className="font-medium">
                                    {formatNumber(competenceRating)}
                                </span>
                                <Percent className="h-3.5 w-3.5 shrink-0" />
                            </span>
                        </div>
                    )}
                    <div className="flex flex-row items-center gap-1 break-words text-muted-foreground text-sm">
                        {insightTitle ?? 'Competence Insight'}
                    </div>
                </div>
            </div>
        </Card>
    );
}
