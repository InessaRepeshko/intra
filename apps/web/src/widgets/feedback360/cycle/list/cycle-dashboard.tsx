'use client';

import { format } from 'date-fns';
import {
    Archive,
    Calendar,
    FileChartLine,
    FilePlus2,
    Hourglass,
    NotebookTabs,
    Pencil,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import {
    useCyclesQuery,
    useReviewCountsQuery,
} from '@entities/feedback360/cycle/api/cycle.queries';
import type { Cycle } from '@entities/feedback360/cycle/model/mappers';
import {
    CYCLE_STAGE_ENUM_VALUES,
    CycleStage,
} from '@entities/feedback360/cycle/model/types';
import {
    StageBadge,
    stageConfig,
} from '@entities/feedback360/cycle/ui/stage-badge';
import { useReviewsQuery } from '@entities/feedback360/review/api/review.queries';
import { Review } from '@entities/feedback360/review/model/mappers';
import { ReviewStage } from '@entities/feedback360/review/model/types';
import { type AuthContextType } from '@entities/identity/user/model/types';
import { Button } from '@shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import { Progress } from '@shared/components/ui/progress';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@shared/components/ui/tabs';
import { formatNumber } from '@shared/lib/utils/format-number';
import { StatisticsCard } from '@shared/ui/statistics-card';

export function CycleDashboard({
    currentUser,
}: {
    currentUser: AuthContextType;
}) {
    const [activeTab, setActiveTab] = useState<CycleStage>(CycleStage.ACTIVE);

    const { data: allCyclesData = [] } = useCyclesQuery({});

    const cycleIds = useMemo(
        () => allCyclesData.map((c) => c.id),
        [allCyclesData],
    );
    const { reviewCounts } = useReviewCountsQuery(cycleIds);

    const { data: allCycleReviews = [] } = useReviewsQuery();

    const cyclesByStage = useMemo(() => {
        const buckets = Object.fromEntries(
            CYCLE_STAGE_ENUM_VALUES.map((s) => [s, [] as Cycle[]]),
        ) as Record<CycleStage, Cycle[]>;
        allCyclesData
            .sort((a, b) => b.id - a.id)
            .forEach((c) => {
                if (c.stage && buckets[c.stage]) buckets[c.stage].push(c);
            });
        return buckets;
    }, [allCyclesData]);

    const reviewsByCycleId = useMemo(() => {
        const map: Record<number, Review[]> = {};
        allCycleReviews.forEach((review) => {
            if (review.cycleId) {
                if (!map[review.cycleId]) {
                    map[review.cycleId] = [];
                }
                map[review.cycleId].push(review);
            }
        });
        return map;
    }, [allCycleReviews]);

    return (
        <Card className="mx-auto gap-6 sm:gap-8 flex flex-col w-full h-full border-border p-4 sm:p-6 md:p-8 overflow-hidden">
            {/* Cycles Dashboard Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground break-words">
                        360° Feedback Cycles Dashboard
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Overview of cycles across all stages.{' '}Total{' '}
                        <span className="font-medium text-foreground">
                            {cyclesByStage[CycleStage.ACTIVE].length}
                        </span>{' '}
                        active cycles.
                    </p>
                </div>
            </div>

            {/* Cycle stats */}
            <div className="flex flex-row flex-wrap w-full gap-3 sm:gap-4 md:gap-6 justify-around">
                <StatisticsCard
                    title={`New`}
                    value={
                        formatNumber(cyclesByStage[CycleStage.NEW].length) ??
                        '-'
                    }
                    icon={FilePlus2}
                    color="text-blue-300"
                    width={200}
                />
                <StatisticsCard
                    title={`Active`}
                    value={
                        formatNumber(cyclesByStage[CycleStage.ACTIVE].length) ??
                        '-'
                    }
                    icon={Hourglass}
                    color="text-amber-300"
                    width={200}
                />
                <StatisticsCard
                    title={`Finished`}
                    value={
                        formatNumber(
                            cyclesByStage[CycleStage.FINISHED].length +
                                cyclesByStage[CycleStage.PREPARING_REPORT]
                                    .length +
                                cyclesByStage[CycleStage.PUBLISHED].length,
                        ) ?? '-'
                    }
                    icon={FileChartLine}
                    color="text-green-300"
                    width={200}
                />
                <StatisticsCard
                    title={`Archived`}
                    value={
                        formatNumber(
                            cyclesByStage[CycleStage.ARCHIVED].length +
                                cyclesByStage[CycleStage.CANCELED].length,
                        ) ?? '-'
                    }
                    icon={Archive}
                    color="text-zinc-300"
                    width={200}
                />
            </div>

            {/* Cycle List Tabs */}
            <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as CycleStage)}
                className="w-full overflow-hidden"
            >
                <TabsList
                    variant="default"
                    className="flex flex-wrap h-auto justify-start gap-1 overflow-x-auto rounded-xl p-1"
                >
                    {CYCLE_STAGE_ENUM_VALUES.map((stage) => (
                        <TabsTrigger
                            key={stage}
                            value={stage}
                            className="rounded-xl text-sm whitespace-nowrap text-center"
                        >
                            {stageConfig[stage].label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {CYCLE_STAGE_ENUM_VALUES.map((stage) => (
                    <TabsContent key={stage} value={stage}>
                        <Card className="border-[0px]">
                            <CardHeader className="px-2">
                                <CardTitle className="text-foreground text-lg break-words">
                                    {stageConfig[stage].label} Cycles
                                </CardTitle>
                                <CardDescription className="text-base">
                                    A total of{' '}
                                    <span className="font-semibold text-foreground">
                                        {cyclesByStage[stage].length}
                                    </span>{' '}
                                    {cyclesByStage[stage].length !== 1
                                        ? 'cycles are'
                                        : 'cycle is'}{' '}
                                    currently at the {stageConfig[stage].label}{' '}
                                    stage.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="space-y-6">
                                    {cyclesByStage[stage].length === 0 ? (
                                        <div className="py-12 text-center text-muted-foreground">
                                            No cycles in this stage
                                        </div>
                                    ) : (
                                        cyclesByStage[stage].map((cycle) => {
                                            const totalReviewsInCycle =
                                                reviewsByCycleId[cycle.id]
                                                    ?.length ?? 0;
                                            const completedReviewsInCycleCount =
                                                reviewsByCycleId[
                                                    cycle.id
                                                ]?.filter((review) =>
                                                    [
                                                        ReviewStage.FINISHED,
                                                        ReviewStage.PREPARING_REPORT,
                                                        ReviewStage.PROCESSING_BY_HR,
                                                        ReviewStage.PUBLISHED,
                                                        ReviewStage.ANALYSIS,
                                                    ].includes(review.stage),
                                                ).length ?? 0;

                                            return (
                                                <div
                                                    key={cycle.id}
                                                    className="flex flex-col lg:flex-row !flex-wrap items-stretch lg:items-center justify-between gap-6 p-4 rounded-2xl border border-border shadow-sm w-full overflow-hidden"
                                                >
                                                    <div className="flex flex-col items-start gap-4 text-left flex-1 min-w-[100px] w-full">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <p className="font-medium text-lg text-foreground break-words">
                                                                {cycle.title}
                                                            </p>
                                                            <StageBadge
                                                                stage={
                                                                    cycle.stage
                                                                }
                                                            />
                                                        </div>
                                                        {cycle.description && (
                                                            <p className="text-muted-foreground text-base break-words">
                                                                {
                                                                    cycle.description
                                                                }
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-x-2 text-base flex-wrap">
                                                            <span className="font-medium text-foreground flex-wrap flex gap-1 x">
                                                                <span className="flex items-center gap-1 flex-wrap">
                                                                    <Calendar className="shrink-0 h-4 w-4 text-muted-foreground" />
                                                                    <span className="text-muted-foreground">
                                                                        From{' '}
                                                                    </span>
                                                                    {format(
                                                                        cycle.startDate,
                                                                        'd MMMM yyyy',
                                                                    )}
                                                                    <span className="text-muted-foreground">
                                                                        to{' '}
                                                                    </span>
                                                                    {format(
                                                                        cycle.endDate,
                                                                        'd MMMM yyyy',
                                                                    )}
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-row items-center gap-y-2 gap-x-8 w-full sm:w-auto flex-wrap justify-center lg:justify-end">
                                                        {stage ===
                                                            CycleStage.ACTIVE && (
                                                            <Progress
                                                                value={
                                                                    totalReviewsInCycle >
                                                                    0
                                                                        ? (completedReviewsInCycleCount /
                                                                              totalReviewsInCycle) *
                                                                          100
                                                                        : 0
                                                                }
                                                                className="w-[200px] max-w-full rounded-full self-center"
                                                            />
                                                        )}
                                                        <div className="flex flex-row items-center gap-x-1 gap-y-0 text-base flex-wrap justify-center lg:justify-end">
                                                            <NotebookTabs className="shrink-0 h-4 w-4 text-muted-foreground" />
                                                            <span className="font-medium text-foreground whitespace-nowrap flex gap-1">
                                                                {
                                                                    completedReviewsInCycleCount
                                                                }
                                                                <span className="text-muted-foreground">
                                                                    /
                                                                </span>
                                                                {reviewCounts[
                                                                    cycle.id
                                                                ] ?? 0}
                                                            </span>
                                                            <span className="text-muted-foreground whitespace-nowrap">
                                                                reviews
                                                            </span>
                                                        </div>
                                                        <Button
                                                            asChild
                                                            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl w-full md:w-auto min-w-[120px]"
                                                        >
                                                            <Link
                                                                href={`/feedback360/cycles/${cycle.id}`}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </Card>
    );
}
