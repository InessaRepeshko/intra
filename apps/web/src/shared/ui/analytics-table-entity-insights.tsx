import {
    ReportAnalytics,
    ReportInsight,
} from '@entities/reporting/individual-report/model/mappers';
import {
    EntityType,
    InsightType,
} from '@entities/reporting/individual-report/model/types';
import {
    StrategicReportAnalytics,
    StrategicReportInsight,
} from '@entities/reporting/strategic-report/model/mappers';
import { Button } from '@shared/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@shared/components/ui/tooltip';
import { formatNumber } from '@shared/lib/utils/format-number';
import {
    Lightbulb,
    LucideIcon,
    Search,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';

export const insightInfo: Record<
    InsightType,
    { id: string; label: string; icon: LucideIcon }
> = {
    [InsightType.HIGHEST_RATING]: {
        id: 'highest',
        label: 'Highest Rating',
        icon: TrendingUp,
    },
    [InsightType.LOWEST_RATING]: {
        id: 'lowest',
        label: 'Lowest Rating',
        icon: TrendingDown,
    },
    [InsightType.HIGHEST_DELTA]: {
        id: 'hidden_strength',
        label: 'Hidden Strength',
        icon: Lightbulb,
    },
    [InsightType.LOWEST_DELTA]: {
        id: 'blind_spot',
        label: 'Potential Blind Spot',
        icon: Search,
    },
};

export const AnalyticsTableEntityInsights = ({
    insights,
    analytics,
    entityType,
}: {
    insights: ReportInsight[] | StrategicReportInsight[];
    analytics: ReportAnalytics[] | StrategicReportAnalytics[];
    entityType: EntityType;
}) => {
    const entityName =
        entityType === EntityType.COMPETENCE ? 'competence' : 'question';
    const sortedSummaries = ([...analytics] as any[])
        .filter((a) => {
            if (a.entityType !== undefined) {
                return a.entityType === entityType;
            }
            return entityType === EntityType.COMPETENCE;
        })
        .sort((a, b) => {
            const aTitle =
                entityType === EntityType.COMPETENCE
                    ? (a.competenceTitle ?? '')
                    : (a.questionTitle ?? '');
            const bTitle =
                entityType === EntityType.COMPETENCE
                    ? (b.competenceTitle ?? '')
                    : (b.questionTitle ?? '');
            return aTitle.localeCompare(bTitle);
        })
        .map((summary, index) => ({
            ...summary,
            index: index + 1,
        }));

    const insightData = insights.map((insight) => {
        return {
            id: insightInfo[insight.insightType].id,
            label: insightInfo[insight.insightType].label,
            icon: insightInfo[insight.insightType].icon,
            title: insight.competenceTitle ?? insight.questionTitle,
            value:
                insight.insightType === InsightType.HIGHEST_RATING ||
                insight.insightType === InsightType.LOWEST_RATING
                    ? `${formatNumber(insight.averageRating)}%`
                    : `${formatNumber(insight.averageDelta)}%`,
            num: sortedSummaries.find((summary) =>
                entityType === EntityType.COMPETENCE
                    ? summary.competenceId === insight.competenceId
                    : summary.questionId === insight.questionId,
            )?.index,
        };
    });

    return (
        <TooltipProvider>
            <div className="flex flex-wrap gap-2 sm:gap-1 md:gap-2 items-center text-sm">
                {insightData.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Tooltip key={item.id}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 h-auto py-1.5 px-3 rounded-full border-border/60 text-left w-full sm:w-auto transition-colors hover:bg-muted`}
                                >
                                    <Icon
                                        className={`h-3.5 w-3.5 shrink-0 mt-0.5 sm:mt-0 text-muted-foreground`}
                                    />
                                    <span className="whitespace-normal leading-tight text-center">
                                        {item.num ? (
                                            <span className="text-foreground font-medium mr-1">
                                                #{item.num}
                                            </span>
                                        ) : null}
                                        {item.label}
                                    </span>
                                    <span
                                        className={`font-bold tracking-tight whitespace-normal leading-tight truncate text-foreground`}
                                    >
                                        {item.value}
                                    </span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                side="top"
                                sideOffset={6}
                                className="max-w-[340px] p-4 bg-popover shadow-sm border border-border/60 rounded-xl break-words overflow-anywhere"
                            >
                                <div className="flex flex-col flex-wrap gap-2.5 text-sm leading-snug text-muted-foreground">
                                    {item.id === 'highest' && (
                                        <p>
                                            The {entityName}{' '}
                                            <b className="text-foreground">
                                                #{item.num}
                                            </b>{' '}
                                            regarding{' '}
                                            <b className="text-foreground font-medium italic">
                                                "{item.title}"
                                            </b>{' '}
                                            emerged as the most highly-rated
                                            area in this assessment with an
                                            average rating of{' '}
                                            <b className="text-foreground">
                                                {item.value}
                                            </b>
                                            , representing the strongest
                                            consensus of excellence.
                                        </p>
                                    )}
                                    {item.id === 'lowest' && (
                                        <p>
                                            The {entityName}{' '}
                                            <b className="text-foreground">
                                                #{item.num}
                                            </b>{' '}
                                            regarding{' '}
                                            <b className="text-foreground font-medium italic">
                                                "{item.title}"
                                            </b>{' '}
                                            with an average rating of{' '}
                                            <b className="text-foreground">
                                                {item.value}
                                            </b>{' '}
                                            reflects the most significant
                                            opportunity for targeted
                                            professional development.
                                        </p>
                                    )}
                                    {item.id === 'blind_spot' && (
                                        <p>
                                            The maximum variance of{' '}
                                            <b className="text-foreground">
                                                {item.value}
                                            </b>{' '}
                                            in {entityName}{' '}
                                            <b className="text-foreground">
                                                #{item.num}
                                            </b>{' '}
                                            <b className="text-foreground font-medium italic">
                                                "{item.title}"
                                            </b>{' '}
                                            indicates a critical misalignment
                                            where self-perception exceeds
                                            external evaluation.
                                        </p>
                                    )}
                                    {item.id === 'hidden_strength' && (
                                        <p>
                                            The notable negative variance of{' '}
                                            <b className="text-foreground">
                                                {item.value}
                                            </b>{' '}
                                            in {entityName}{' '}
                                            <b className="text-foreground">
                                                #{item.num}
                                            </b>{' '}
                                            <b className="text-foreground font-medium italic">
                                                "{item.title}"
                                            </b>{' '}
                                            identifies an undervalued asset
                                            where the actual impact
                                            significantly surpasses
                                            self-assessment.
                                        </p>
                                    )}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </div>
        </TooltipProvider>
    );
};
