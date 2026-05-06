'use client';

import { format } from 'date-fns';
import {
    Bookmark,
    Calendar,
    Layers,
    NotebookTabs,
    RefreshCcw,
    Scale,
    Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { useCyclesQuery } from '@entities/feedback360/cycle/api/cycle.queries';
import { type AuthContextType } from '@entities/identity/user/model/types';
import {
    useClusterScoreAnalyticsClusterScoreTitlesQuery,
    useClusterScoreAnalyticsCompetenceTitlesQuery,
    useClusterScoreAnalyticsCycleTitlesQuery,
    useClusterScoresAnalyticsQuery,
} from '@entities/reporting/cluster-score-analytics/api/cluster-score-analytics.queries';
import type { ClusterScoreAnalytics } from '@entities/reporting/cluster-score-analytics/model/mappers';
import { predefinedColors } from '@entities/reporting/cluster-score-analytics/ui/cluster-badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@shared/components/ui/tabs';
import { cn } from '@shared/lib/utils/cn';
import { formatNumber } from '@shared/lib/utils/format-number';
import { StatisticsCard } from '@shared/ui/statistics-card';

export function ClusterScoreAnalyticsDashboard({
    currentUser: _currentUser,
}: {
    currentUser: AuthContextType;
}) {
    const [activeTab, setActiveTab] = useState<number>(-1);

    const { data: allAnalytics = [] } = useClusterScoresAnalyticsQuery({});
    const { data: allCycles = [] } = useCyclesQuery();

    const allClusterIds = useMemo(
        () =>
            Array.from(
                new Set(
                    allAnalytics
                        .map((a) => a.clusterId)
                        .filter(
                            (id): id is number =>
                                id !== null && id !== undefined,
                        ),
                ),
            ),
        [allAnalytics],
    );

    const { clusterData: clusterScoreTitles } =
        useClusterScoreAnalyticsClusterScoreTitlesQuery(allClusterIds);

    const competenceIds = useMemo(
        () =>
            Array.from(
                new Set(
                    Object.values(clusterScoreTitles)
                        .map((c) => c.competenceId)
                        .filter(
                            (id): id is number =>
                                id !== null && id !== undefined,
                        ),
                ),
            ),
        [clusterScoreTitles],
    );

    const { competenceTitles } =
        useClusterScoreAnalyticsCompetenceTitlesQuery(competenceIds);

    const allAnalyticsCycleIds = useMemo(
        () =>
            Array.from(
                new Set(
                    allAnalytics
                        .map((a) => a.cycleId)
                        .filter(
                            (id): id is number =>
                                id !== null && id !== undefined,
                        ),
                ),
            ),
        [allAnalytics],
    );
    const { cycleTitles } =
        useClusterScoreAnalyticsCycleTitlesQuery(allAnalyticsCycleIds);

    const cycleById = useMemo(
        () => new Map(allCycles.map((c) => [c.id, c])),
        [allCycles],
    );

    const cyclesWithAnalytics = useMemo(
        () =>
            allAnalyticsCycleIds
                .map((id) => ({
                    id,
                    title:
                        cycleById.get(id)?.title ??
                        cycleTitles[id] ??
                        `Cycle #${id}`,
                }))
                .sort((a, b) => a.title.localeCompare(b.title)),
        [allAnalyticsCycleIds, cycleById, cycleTitles],
    );

    const cycleOptions = useMemo(
        () => [
            { value: -1, label: 'All cycles' },
            ...allCycles.map((c) => ({
                value: c.id,
                label: c.title,
            })),
        ],
        [cyclesWithAnalytics],
    );

    const analyticsByCycle = useMemo(() => {
        const buckets: Record<number, ClusterScoreAnalytics[]> = {};
        buckets[-1] = [...allAnalytics].sort(
            (a, b) => b.id - a.id,
        );
        allAnalytics.forEach((a) => {
            if (a.cycleId === null || a.cycleId === undefined) return;
            if (!buckets[a.cycleId]) buckets[a.cycleId] = [];
            buckets[a.cycleId].push(a);
        });
        return buckets;
    }, [allAnalytics]);

    const totalAnalytics = allAnalytics.length;
    const totalCycles = cyclesWithAnalytics.length;
    const totalCompetences = competenceIds.length;
    const averageScoreOverall = useMemo(() => {
        const scores = allAnalytics
            .map((a) => a.averageScore)
            .filter((v): v is number => v !== null && v !== undefined);
        if (scores.length === 0) return 0;
        return (
            Math.round(
                (scores.reduce((sum, v) => sum + v, 0) / scores.length) * 100,
            ) / 100
        );
    }, [allAnalytics]);

    return (
        <Card className="mx-auto gap-6 sm:gap-8 flex flex-col w-full h-full border-border p-4 sm:p-6 md:p-8 overflow-hidden">
            {/* Cluster Score Analytics Dashboard Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground break-words">
                        360° Feedback Cluster Score Analytics Dashboard
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Overview of cluster score analytics grouped by cycle.
                        Total{' '}
                        <span className="font-medium text-foreground">
                            {totalAnalytics}
                        </span>{' '}
                        record{totalAnalytics === 1 ? '' : 's'} across{' '}
                        <span className="font-medium text-foreground">
                            {totalCycles}
                        </span>{' '}
                        {totalCycles === 1 ? 'cycle' : 'cycles'}.
                    </p>
                </div>
            </div>

            {/* Cluster Score Analytics stats */}
            <div className="flex flex-row flex-wrap w-full gap-3 sm:gap-4 md:gap-6 justify-around">
                <StatisticsCard
                    title={`Records`}
                    value={formatNumber(totalAnalytics) ?? '-'}
                    icon={NotebookTabs}
                    color="text-indigo-300"
                    width={250}
                />
                <StatisticsCard
                    title={`Cycles`}
                    value={formatNumber(totalCycles) ?? '-'}
                    icon={RefreshCcw}
                    color="text-fuchsia-300"
                    width={250}
                />
                <StatisticsCard
                    title={`Competences`}
                    value={formatNumber(totalCompetences) ?? '-'}
                    icon={Bookmark}
                    color="text-orange-300"
                    width={250}
                />
                <StatisticsCard
                    title={`Avg Score`}
                    value={formatNumber(averageScoreOverall) ?? '-'}
                    icon={Scale}
                    color="text-rose-300"
                    width={250}
                />
            </div>

            {/* Analytics List Tabs by Cycle */}
            <Tabs
                value={String(activeTab)}
                onValueChange={(v) => setActiveTab(Number(v))}
                className="w-full overflow-hidden"
            >
                <TabsList
                    variant="default"
                    className="flex flex-wrap h-auto justify-start gap-1 overflow-x-auto rounded-xl p-1"
                >
                    {cycleOptions.map((cycle) => (
                        <TabsTrigger
                            key={cycle.value}
                            value={String(cycle.value)}
                            className="rounded-xl text-sm whitespace-nowrap text-center"
                        >
                            {cycle.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {cycleOptions.map((cycle) => {
                    const analytics = analyticsByCycle[cycle.value] ?? [];
                    const cycleTitle = cycle.label;

                    // Group records by (cycleId, competenceId) so that one card
                    // shows all cluster levels for a single competence.
                    const competenceGroupsMap: Record<
                        string,
                        {
                            cycleId: number;
                            competenceId: number;
                            records: ClusterScoreAnalytics[];
                        }
                    > = {};
                    analytics.forEach((record) => {
                        const competenceId =
                            clusterScoreTitles[record.clusterId]?.competenceId;
                        if (
                            competenceId === undefined ||
                            competenceId === null
                        ) {
                            return;
                        }
                        const key = `${record.cycleId}-${competenceId}`;
                        if (!competenceGroupsMap[key]) {
                            competenceGroupsMap[key] = {
                                cycleId: record.cycleId,
                                competenceId,
                                records: [],
                            };
                        }
                        competenceGroupsMap[key].records.push(record);
                    });
                    const competenceGroups = Object.values(
                        competenceGroupsMap,
                    ).map((g) => ({
                        ...g,
                        records: [...g.records].sort(
                            (a, b) => (a.lowerBound ?? 0) - (b.lowerBound ?? 0),
                        ),
                    }));

                    return (
                        <TabsContent
                            key={cycle.value}
                            value={String(cycle.value)}
                        >
                            <Card className="border-[0px] shadow-none">
                                <CardHeader className="px-2">
                                    <CardTitle className="text-foreground text-lg break-words">
                                        {cycleTitle}
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        A total of{' '}
                                        <span className="font-semibold text-foreground">
                                            {competenceGroups.length}
                                        </span>{' '}
                                        {competenceGroups.length === 1
                                            ? 'competence is'
                                            : 'competences are'}{' '}
                                        analyzed (
                                        <span className="font-semibold text-foreground">
                                            {analytics.length}
                                        </span>{' '}
                                        cluster{' '}
                                        {analytics.length === 1
                                            ? 'level'
                                            : 'levels'}
                                        ) for{' '}
                                        {cycle.value === -1
                                            ? `the ${cycleTitle}`
                                            : `the ${cycleTitle} cycle`}
                                        .
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="space-y-6">
                                        {competenceGroups.length === 0 ? (
                                            <div className="py-12 text-center text-muted-foreground">
                                                No cluster score analytics for
                                                this cycle
                                            </div>
                                        ) : (
                                            competenceGroups.map((group) => {
                                                const competence =
                                                    competenceTitles[
                                                        group.competenceId
                                                    ];
                                                const groupCycle =
                                                    cycleById.get(
                                                        group.cycleId,
                                                    );
                                                const groupCycleTitle =
                                                    groupCycle?.title ??
                                                    cycleTitles[
                                                        group.cycleId
                                                    ] ??
                                                    null;
                                                const totalEmployees =
                                                    group.records.reduce(
                                                        (sum, r) =>
                                                            sum +
                                                            (r.employeesCount ??
                                                                0),
                                                        0,
                                                    );
                                                const latestCreatedAt =
                                                    group.records.reduce(
                                                        (max, r) =>
                                                            r.createdAt.getTime() >
                                                            max.getTime()
                                                                ? r.createdAt
                                                                : max,
                                                        group.records[0]
                                                            .createdAt,
                                                    );

                                                return (
                                                    <div
                                                        key={`${group.cycleId}-${group.competenceId}`}
                                                        className="flex flex-col gap-4 p-4 rounded-2xl border border-border shadow-sm w-full overflow-hidden"
                                                    >
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <p className="font-medium text-lg text-foreground break-words">
                                                                    <Bookmark className="inline-block shrink-0 h-5 w-5 mr-1 text-muted-foreground align-text-bottom" />
                                                                    {competence?.title ??
                                                                        `Competence #${group.competenceId}`}
                                                                </p>
                                                            </div>
                                                            {competence?.description && (
                                                                <p className="text-muted-foreground text-base break-words">
                                                                    {
                                                                        competence.description
                                                                    }
                                                                </p>
                                                            )}
                                                            {groupCycleTitle && (
                                                                <div className="flex flex-wrap items-center gap-x-2 text-base text-muted-foreground">
                                                                    <RefreshCcw className="shrink-0 h-4 w-4" />
                                                                    <span className="break-words">
                                                                        {
                                                                            groupCycleTitle
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {/* Aggregate footer */}
                                                        <div className="flex flex-row items-center gap-y-2 gap-x-6 flex-wrap justify-between text-base">
                                                            <div className="flex flex-row items-center gap-x-2 flex-wrap">
                                                                <Layers className="shrink-0 h-4 w-4 text-muted-foreground" />
                                                                <span className="text-muted-foreground whitespace-nowrap">
                                                                    <span className="text-foreground font-medium">
                                                                        {
                                                                            group
                                                                                .records
                                                                                .length
                                                                        }{' '}
                                                                    </span>
                                                                    cluster{' '}
                                                                    {group
                                                                        .records
                                                                        .length ===
                                                                    1
                                                                        ? 'level'
                                                                        : 'levels'}
                                                                </span>
                                                                <span className="text-muted-foreground">
                                                                    •
                                                                </span>
                                                                <Users className="shrink-0 h-4 w-4 text-muted-foreground" />
                                                                <span className="font-medium text-foreground whitespace-nowrap">
                                                                    {
                                                                        totalEmployees
                                                                    }
                                                                </span>
                                                                <span className="text-muted-foreground whitespace-nowrap">
                                                                    total
                                                                    employees
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-row items-center gap-x-1 flex-wrap">
                                                                <Calendar className="shrink-0 h-4 w-4 text-muted-foreground" />
                                                                <span className="text-muted-foreground whitespace-nowrap">
                                                                    Generated
                                                                </span>
                                                                <span className="font-medium text-foreground whitespace-nowrap">
                                                                    {format(
                                                                        latestCreatedAt,
                                                                        'MMM dd, yyyy',
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {/* Cluster levels for this competence */}
                                                        <div className="flex flex-col gap-2">
                                                            {group.records.map(
                                                                (record) => {
                                                                    const cluster =
                                                                        clusterScoreTitles[
                                                                            record
                                                                                .clusterId
                                                                        ];
                                                                    const colors =
                                                                        predefinedColors[
                                                                            cluster.title.toLowerCase()
                                                                        ] ??
                                                                        'border-border bg-muted/30';
                                                                    return (
                                                                        <div
                                                                            key={
                                                                                record.id
                                                                            }
                                                                            className={cn(
                                                                                colors,
                                                                                'flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-y-2 gap-x-6 p-3 rounded-xl border w-full overflow-hidden',
                                                                            )}
                                                                        >
                                                                            <div className="flex flex-row items-center gap-x-3 gap-y-2 flex-wrap min-w-[180px]">
                                                                                <span className="text-muted-foreground border border-border border-foreground/50 rounded-xl px-1 text-sm break-words">
                                                                                    #
                                                                                    {
                                                                                        record.id
                                                                                    }
                                                                                </span>
                                                                                <span className="font-medium text-foreground break-words">
                                                                                    {cluster?.title ??
                                                                                        `Cluster #${record.clusterId}`}
                                                                                </span>
                                                                                {/* <ClusterBadge
                                                                                    key={cluster.title}
                                                                                    label={cluster.title}
                                                                                    className="text-sm"
                                                                                /> */}
                                                                                <span className="inline-flex items-center gap-1 text-base text-muted-foreground whitespace-nowrap">
                                                                                    <span className="text-muted-foreground">
                                                                                        from
                                                                                    </span>
                                                                                    <span className="font-medium text-foreground">
                                                                                        {record.lowerBound ??
                                                                                            '–'}{' '}
                                                                                    </span>
                                                                                    <span className="text-muted-foreground">
                                                                                        to
                                                                                    </span>
                                                                                    <span className="font-medium text-foreground">
                                                                                        {record.upperBound ??
                                                                                            '–'}
                                                                                    </span>
                                                                                </span>
                                                                            </div>

                                                                            <div className="flex flex-row items-center gap-y-2 gap-x-6 flex-wrap justify-center lg:justify-end">
                                                                                <div className="flex flex-row items-center gap-x-1 text-base flex-wrap justify-center lg:justify-end">
                                                                                    <Users className="shrink-0 h-4 w-4 text-muted-foreground" />
                                                                                    <span className="font-medium text-foreground whitespace-nowrap">
                                                                                        {record.employeesCount ??
                                                                                            0}
                                                                                    </span>
                                                                                    <span className="text-muted-foreground whitespace-nowrap">
                                                                                        {record.employeesCount ===
                                                                                        1
                                                                                            ? 'employee'
                                                                                            : 'employees'}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="flex flex-row items-center gap-x-1 text-base flex-wrap justify-center lg:justify-end">
                                                                                    <span className="text-muted-foreground whitespace-nowrap">
                                                                                        Min
                                                                                    </span>
                                                                                    <span className="font-medium text-foreground whitespace-nowrap">
                                                                                        {formatNumber(
                                                                                            record.minScore ??
                                                                                                '-',
                                                                                        )}
                                                                                    </span>
                                                                                    <span className="text-muted-foreground whitespace-nowrap">
                                                                                        /
                                                                                    </span>
                                                                                    <span className="text-muted-foreground whitespace-nowrap">
                                                                                        Max
                                                                                    </span>
                                                                                    <span className="font-medium text-foreground whitespace-nowrap">
                                                                                        {formatNumber(
                                                                                            record.maxScore ??
                                                                                                '-',
                                                                                        )}
                                                                                    </span>
                                                                                    <span className="text-muted-foreground whitespace-nowrap">
                                                                                        /
                                                                                    </span>
                                                                                    <span className="text-muted-foreground whitespace-nowrap">
                                                                                        Avg
                                                                                    </span>
                                                                                    <span className="font-medium text-foreground whitespace-nowrap">
                                                                                        {formatNumber(
                                                                                            record.averageScore ??
                                                                                                '-',
                                                                                        )}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                },
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    );
                })}
            </Tabs>
        </Card>
    );
}
