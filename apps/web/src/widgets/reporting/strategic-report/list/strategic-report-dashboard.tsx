'use client';

import { format } from 'date-fns';
import {
    Archive,
    Calendar,
    Eye,
    FileChartLine,
    FilePlus2,
    Hourglass,
    UserRound,
    Users,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { AvatarGroupWithCount } from '@/shared/ui/avatar-group-with-count';
import { useCyclesQuery } from '@entities/feedback360/cycle/api/cycle.queries';
import {
    CYCLE_STAGE_ENUM_VALUES,
    CycleStage,
} from '@entities/feedback360/cycle/model/types';
import {
    StageBadge,
    stageConfig,
} from '@entities/feedback360/cycle/ui/stage-badge';
import { type AuthContextType } from '@entities/identity/user/model/types';
import {
    useAllStrategicReportRateesQuery,
    useStrategicReportAllTeamTitlesQuery,
    useStrategicReportsQuery,
} from '@entities/reporting/strategic-report/api/strategic-report.queries';
import type { StrategicReport } from '@entities/reporting/strategic-report/model/mappers';
import { Button } from '@shared/components/ui/button';
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
import { formatNumber } from '@shared/lib/utils/format-number';
import { StatisticsCard } from '@shared/ui/statistics-card';

export function StrategicReportDashboard({
    currentUser: _currentUser,
}: {
    currentUser: AuthContextType;
}) {
    const [activeTab, setActiveTab] = useState<CycleStage | 'ALL'>('ALL');
    const cycleStageTabOptions = ['ALL', ...CYCLE_STAGE_ENUM_VALUES];

    const { data: allReportsData = [] } = useStrategicReportsQuery({});
    const { data: allCyclesData = [] } = useCyclesQuery();

    const allCycleIds = useMemo(
        () => allReportsData.map((r) => r.cycleId),
        [allReportsData],
    );

    const { ratees: rateeData = [] } =
        useAllStrategicReportRateesQuery(allCycleIds);
    const { teamTitles = {} } =
        useStrategicReportAllTeamTitlesQuery(allCycleIds);

    const cycleById = useMemo(
        () => new Map(allCyclesData.map((c) => [c.id, c])),
        [allCyclesData],
    );

    const reportsByStage = useMemo(() => {
        const buckets = Object.fromEntries(
            CYCLE_STAGE_ENUM_VALUES.map((s) => [s, [] as StrategicReport[]]),
        ) as Record<CycleStage | 'ALL', StrategicReport[]>;
        const sortedReports = [...allReportsData].sort((a, b) => b.id - a.id);
        buckets['ALL'] = sortedReports;
        sortedReports.forEach((r) => {
            const stage = cycleById.get(r.cycleId)?.stage;
            if (stage && buckets[stage]) buckets[stage].push(r);
        });
        return buckets;
    }, [allReportsData, cycleById]);

    const newCount = reportsByStage[CycleStage.NEW]?.length ?? 0;
    const activeCount = reportsByStage[CycleStage.ACTIVE]?.length ?? 0;
    const finishedCount =
        (reportsByStage[CycleStage.FINISHED]?.length ?? 0) +
        (reportsByStage[CycleStage.PREPARING_REPORT]?.length ?? 0) +
        (reportsByStage[CycleStage.PUBLISHED]?.length ?? 0);
    const archivedCount =
        (reportsByStage[CycleStage.ARCHIVED]?.length ?? 0) +
        (reportsByStage[CycleStage.CANCELED]?.length ?? 0);

    return (
        <Card className="mx-auto gap-6 sm:gap-8 flex flex-col w-full h-full border-border p-4 sm:p-6 md:p-8 overflow-hidden">
            {/* Strategic Reports Dashboard Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground break-words">
                        360° Feedback Strategic Reports Dashboard
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Overview of strategic reports grouped by cycle stage.{' '}
                        Total{' '}
                        <span className="font-medium text-foreground">
                            {finishedCount}
                        </span>{' '}
                        report
                        {finishedCount === 1 ? ' is' : 's are'} published.
                    </p>
                </div>
            </div>

            {/* Strategic Report stats */}
            <div className="flex flex-row flex-wrap w-full gap-3 sm:gap-4 md:gap-6 justify-around">
                <StatisticsCard
                    title={`New`}
                    value={formatNumber(newCount) ?? '-'}
                    icon={FilePlus2}
                    color="text-blue-300"
                    width={200}
                />
                <StatisticsCard
                    title={`Active`}
                    value={formatNumber(activeCount) ?? '-'}
                    icon={Hourglass}
                    color="text-amber-300"
                    width={200}
                />
                <StatisticsCard
                    title={`Finished`}
                    value={formatNumber(finishedCount) ?? '-'}
                    icon={FileChartLine}
                    color="text-green-300"
                    width={200}
                />
                <StatisticsCard
                    title={`Archived`}
                    value={formatNumber(archivedCount) ?? '-'}
                    icon={Archive}
                    color="text-zinc-300"
                    width={200}
                />
            </div>

            {/* Strategic Report List Tabs by Cycle Stage */}
            <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as CycleStage | 'ALL')}
                className="w-full overflow-hidden"
            >
                <TabsList
                    variant="default"
                    className="flex flex-wrap h-auto justify-start gap-1 overflow-x-auto rounded-xl p-1"
                >
                    {cycleStageTabOptions.map((stage) => (
                        <TabsTrigger
                            key={stage}
                            value={stage}
                            className="rounded-xl text-sm whitespace-nowrap text-center"
                        >
                            {stage === 'ALL'
                                ? 'All stages'
                                : stageConfig[stage].label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {cycleStageTabOptions.map((stage) => {
                    const stageLabel =
                        stage === 'ALL'
                            ? 'All stages'
                            : stageConfig[stage].label;
                    const reports = reportsByStage[stage];
                    return (
                        <TabsContent key={stage} value={stage}>
                            <Card className="border-[0px] shadow-none">
                                <CardHeader className="px-2">
                                    <CardTitle className="text-foreground text-lg break-words">
                                        {stageLabel} Strategic Reports
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        A total of{' '}
                                        <span className="font-semibold text-foreground">
                                            {reports.length}
                                        </span>{' '}
                                        {reports.length !== 1
                                            ? 'strategic reports are'
                                            : 'strategic report is'}{' '}
                                        available for cycles at the {stageLabel}
                                        {stage === 'ALL' || stage === 'NONE'
                                            ? ''
                                            : ' stage'}
                                        .
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="space-y-6">
                                        {reports.length === 0 ? (
                                            <div className="py-12 text-center text-muted-foreground">
                                                No strategic reports for this
                                                stage
                                            </div>
                                        ) : (
                                            reports.map((report) => {
                                                const cycle = cycleById.get(
                                                    report.cycleId,
                                                );
                                                const reportRatees =
                                                    rateeData.find(
                                                        (d) =>
                                                            d.cycleId ===
                                                            report.cycleId,
                                                    )?.ratees ?? [];
                                                const reportTeams =
                                                    teamTitles[
                                                        report.cycleId
                                                    ] ?? [];

                                                return (
                                                    <div
                                                        key={report.id}
                                                        className="flex flex-col lg:flex-row !flex-wrap items-stretch lg:items-center justify-between gap-6 p-4 rounded-2xl border border-border shadow-sm w-full overflow-hidden"
                                                    >
                                                        <div className="flex flex-col items-start gap-2 text-left flex-1 min-w-[100px] w-full">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <p className="font-medium text-lg text-foreground break-words">
                                                                    <span className="text-muted-foreground border border-border rounded-xl px-1 bg-neutral-100">
                                                                        #
                                                                        {
                                                                            report.id
                                                                        }
                                                                    </span>{' '}
                                                                    {
                                                                        report.cycleTitle
                                                                    }
                                                                </p>
                                                                {cycle?.stage && (
                                                                    <StageBadge
                                                                        stage={
                                                                            cycle.stage
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                            {cycle?.startDate &&
                                                                cycle?.endDate && (
                                                                    <div className="flex flex-wrap items-center gap-x-2 text-base text-muted-foreground">
                                                                        <Calendar className="shrink-0 h-4 w-4" />
                                                                        <span className="break-words">
                                                                            {format(
                                                                                cycle?.startDate ||
                                                                                    '',
                                                                                'MMM dd, yyyy',
                                                                            )}
                                                                            {
                                                                                ' - '
                                                                            }
                                                                            {format(
                                                                                cycle?.endDate ||
                                                                                    '',
                                                                                'MMM dd, yyyy',
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            {reportTeams.length >
                                                                0 && (
                                                                <div className="flex flex-wrap items-center gap-x-2 text-base text-muted-foreground">
                                                                    <Users className="shrink-0 h-4 w-4" />
                                                                    <span className="break-words">
                                                                        {reportTeams
                                                                            .map(
                                                                                (
                                                                                    t,
                                                                                ) =>
                                                                                    t.title,
                                                                            )
                                                                            .join(
                                                                                ', ',
                                                                            )}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {reportRatees.length >
                                                                0 && (
                                                                <div className="flex flex-wrap items-center gap-x-2 text-base text-muted-foreground">
                                                                    <UserRound className="shrink-0 h-4 w-4" />
                                                                    <span className="break-words">
                                                                        <AvatarGroupWithCount
                                                                            users={
                                                                                reportRatees
                                                                            }
                                                                            maxVisibleUsers={
                                                                                4
                                                                            }
                                                                        />
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-row items-center gap-y-2 gap-x-8 w-full sm:w-auto flex-wrap justify-center lg:justify-end">
                                                            <div className="flex flex-row items-center gap-x-1 gap-y-0 text-base flex-wrap justify-center lg:justify-end">
                                                                <Calendar className="shrink-0 h-4 w-4 text-muted-foreground" />
                                                                <span className="text-muted-foreground whitespace-nowrap">
                                                                    Generated
                                                                </span>
                                                                <span className="font-medium text-foreground whitespace-nowrap">
                                                                    {format(
                                                                        report.createdAt,
                                                                        'MMM dd, yyyy',
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <Button
                                                                asChild
                                                                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl w-full md:w-auto min-w-[120px]"
                                                            >
                                                                <Link
                                                                    href={`/reporting/strategic-reports/${report.id}`}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                    View
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
                    );
                })}
            </Tabs>
        </Card>
    );
}
