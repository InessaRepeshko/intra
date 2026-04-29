import { ReportInsight } from '@entities/reporting/individual-report/model/mappers';
import { InsightType } from '@entities/reporting/individual-report/model/types';
import { StrategicReportInsight } from '@entities/reporting/strategic-report/model/mappers';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import { formatNumber } from '@shared/lib/utils/format-number';
import { CompetenceInsightCard } from '@shared/ui/competence-insight-card';
import { Compass, Lightbulb, Search, Trophy } from 'lucide-react';

export function EntityInsightCards({
    insights,
    title,
    description,
}: {
    insights: ReportInsight[] | StrategicReportInsight[];
    title?: string;
    description?: string;
}) {
    if (
        insights === undefined ||
        insights === null ||
        Object.values(insights).every(
            (insight) => insight === undefined || insight === null,
        )
    ) {
        return null;
    }

    const items = {
        highestRating: (insights as unknown as ReportInsight[])?.find(
            (insight) => insight.insightType === InsightType.HIGHEST_RATING,
        ),
        lowestRating: (insights as unknown as ReportInsight[])?.find(
            (insight) => insight.insightType === InsightType.LOWEST_RATING,
        ),
        highestDelta: (insights as unknown as ReportInsight[])?.find(
            (insight) => insight.insightType === InsightType.HIGHEST_DELTA,
        ),
        lowestDelta: (insights as unknown as ReportInsight[])?.find(
            (insight) => insight.insightType === InsightType.LOWEST_DELTA,
        ),
    };

    return (
        <Card className="flex-1 min-w-[95px] w-full overflow-hidden">
            <CardHeader className="items-center pb-0">
                <CardTitle> {title || 'Competence Insights'}</CardTitle>
                <CardDescription>
                    {description ||
                        "The summary highlighting the most significant findings from the 360-degree assessment, including the ratee's core professional excellence, primary development priorities, and critical alignment gaps between self-perception and external feedback."}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row flex-wrap gap-8 w-full justify-around items-center mb-4">
                <CompetenceInsightCard
                    competenceTitle={
                        items.highestRating?.competenceTitle ??
                        (items.highestRating as ReportInsight)?.questionTitle
                    }
                    competenceRating={
                        formatNumber(items.highestRating?.averageRating) ?? '-'
                    }
                    insightTitle="Top Competence"
                    icon={Trophy}
                    textColor="text-lime-300"
                />
                <CompetenceInsightCard
                    competenceTitle={
                        items.lowestRating?.competenceTitle ??
                        (items.lowestRating as ReportInsight)?.questionTitle
                    }
                    competenceRating={
                        formatNumber(items.lowestRating?.averageRating) ?? '-'
                    }
                    insightTitle="Growth Area"
                    icon={Compass}
                    textColor="text-yellow-300"
                />
                {(items.highestDelta?.averageDelta ?? 0) > 0 && (
                    <CompetenceInsightCard
                        competenceTitle={
                            items.highestDelta?.competenceTitle ??
                            (items.highestDelta as ReportInsight)?.questionTitle
                        }
                        competenceRating={
                            items.highestDelta?.averageDelta !== undefined &&
                            items.highestDelta?.averageDelta !== null
                                ? items.highestDelta?.averageDelta < 0
                                    ? `${formatNumber(items.highestDelta?.averageDelta)}`
                                    : `+${formatNumber(items.highestDelta?.averageDelta)}`
                                : '-'
                        }
                        insightTitle="Hidden Strength"
                        icon={Lightbulb}
                        textColor="text-blue-300"
                    />
                )}
                {(items.lowestDelta?.averageDelta ?? 0) < 0 && (
                    <CompetenceInsightCard
                        competenceTitle={
                            items.lowestDelta?.competenceTitle ??
                            (items.lowestDelta as ReportInsight)?.questionTitle
                        }
                        competenceRating={
                            items.lowestDelta?.averageDelta !== undefined &&
                            items.lowestDelta?.averageDelta !== null
                                ? items.lowestDelta.averageDelta < 0
                                    ? `${formatNumber(items.lowestDelta.averageDelta)}`
                                    : `+${formatNumber(items.lowestDelta.averageDelta)}`
                                : '-'
                        }
                        insightTitle="Potential Blind Spot"
                        icon={Search}
                        textColor="text-violet-300"
                    />
                )}
            </CardContent>
        </Card>
    );
}
