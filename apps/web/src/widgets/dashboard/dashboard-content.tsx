'use client';

import { format } from 'date-fns';
import {
    BarChart3,
    Boxes,
    Calendar,
    Eye,
    FileLineChart,
    FileUser,
    Hourglass,
    NotebookTabs,
    RefreshCw,
    SquareCheck,
    TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

import { useCyclesQuery } from '@entities/feedback360/cycle/api/cycle.queries';
import { CycleStage } from '@entities/feedback360/cycle/model/types';
import { StageBadge as CycleStageBadge } from '@entities/feedback360/cycle/ui/stage-badge';
import { useReviewsQuery } from '@entities/feedback360/review/api/review.queries';
import { ReviewStage } from '@entities/feedback360/review/model/types';
import { StageBadge as ReviewStageBadge } from '@entities/feedback360/review/ui/stage-badge';
import { AuthContextType } from '@entities/identity/user/model/types';
import { RoleBadge } from '@entities/identity/user/ui/role-badge';
import { useReportsQuery } from '@entities/reporting/individual-report/api/individual-report.queries';
import { useStrategicReportsQuery } from '@entities/reporting/strategic-report/api/strategic-report.queries';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@shared/components/ui/avatar';
import { Button } from '@shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import { Progress } from '@shared/components/ui/progress';
import { formatNumber } from '@shared/lib/utils/format-number';
import { getUserInitialsFromFullName } from '@shared/lib/utils/get-user-initials-from-full-name';
import { StatisticsCard } from '@shared/ui/statistics-card';

export function DashboardContent({
    currentUser,
}: {
    currentUser: AuthContextType;
}) {
    const { user, isAdmin, isHR, isManager, isEmployee } = currentUser;
    const userId = user.id;

    const { data: allCycles = [] } = useCyclesQuery();
    const { data: allReviews = [] } = useReviewsQuery();
    const { data: allIndividualReports = [] } = useReportsQuery({});
    const { data: allStrategicReports = [] } = useStrategicReportsQuery({});

    // Active cycle resolution — pick the most recently started ACTIVE cycle.
    const activeCycles = useMemo(
        () => allCycles.filter((c) => c.stage === CycleStage.ACTIVE),
        [allCycles],
    );
    const currentCycle = useMemo(
        () =>
            [...activeCycles].sort(
                (a, b) => b.startDate.getTime() - a.startDate.getTime(),
            )[0],
        [activeCycles],
    );

    const currentCycleReviews = useMemo(
        () =>
            currentCycle
                ? allReviews.filter((r) => r.cycleId === currentCycle.id)
                : [],
        [allReviews, currentCycle],
    );

    const myReviews = useMemo(
        () => currentCycleReviews.filter((r) => r.rateeId === userId),
        [currentCycleReviews, userId],
    );
    const teamReviews = useMemo(
        () => currentCycleReviews.filter((r) => r.managerId === userId),
        [currentCycleReviews, userId],
    );

    const reviewById = useMemo(
        () => new Map(allReviews.map((r) => [r.id, r])),
        [allReviews],
    );
    const myIndividualReports = useMemo(
        () =>
            allIndividualReports.filter(
                (r) => reviewById.get(r.reviewId)?.rateeId === userId,
            ),
        [allIndividualReports, reviewById, userId],
    );
    const teamIndividualReports = useMemo(
        () =>
            allIndividualReports.filter(
                (r) => reviewById.get(r.reviewId)?.managerId === userId,
            ),
        [allIndividualReports, reviewById, userId],
    );

    const currentCycleStrategicReports = useMemo(
        () =>
            currentCycle
                ? allStrategicReports.filter(
                      (r) => r.cycleId === currentCycle.id,
                  )
                : [],
        [allStrategicReports, currentCycle],
    );

    const reviewsInProgress = useMemo(
        () =>
            currentCycleReviews.filter((r) =>
                [
                    ReviewStage.WAITING_TO_START,
                    ReviewStage.IN_PROGRESS,
                    ReviewStage.SELF_ASSESSMENT,
                ].includes(r.stage),
            ),
        [currentCycleReviews],
    );
    const reviewsFinished = useMemo(
        () =>
            currentCycleReviews.filter((r) =>
                [
                    ReviewStage.FINISHED,
                    ReviewStage.PREPARING_REPORT,
                    ReviewStage.PROCESSING_BY_HR,
                    ReviewStage.PUBLISHED,
                    ReviewStage.ANALYSIS,
                ].includes(r.stage),
            ),
        [currentCycleReviews],
    );

    const cycleProgressPct =
        currentCycleReviews.length > 0
            ? Math.round(
                  (reviewsFinished.length / currentCycleReviews.length) * 100,
              )
            : 0;

    // Role-based view modes (priority: admin/HR > manager > employee).
    const showAdmin = isAdmin || isHR;
    const showManager = !showAdmin && isManager;
    const showEmployee = !showAdmin && !showManager && isEmployee;

    const greetingTitle = showAdmin
        ? `Welcome back, ${user.firstName}!`
        : showManager
          ? `Welcome, ${user.firstName}!`
          : `Hi, ${user.firstName}!`;

    const greetingSubtitle = showAdmin
        ? 'Here is the organization-wide overview of 360° feedback platform.'
        : showManager
          ? 'Here is an overview of your team and your own 360° feedback activity.'
          : 'Here is an overview of your 360° feedback activity.';

    const teamReviewsList = showAdmin ? currentCycleReviews : teamReviews;

    return (
        <div className="flex flex-col gap-6 sm:gap-8 w-full min-w-0">
            <div className="flex flex-row gap-4 w-full justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground break-words">
                        {greetingTitle}
                    </h1>
                    <p className="text-muted-foreground break-words">
                        {greetingSubtitle}
                    </p>
                </div>
                {/* Quick Actions (admin/HR) */}
                {showAdmin && (
                    <div className="flex flex-wrap gap-2 items-end">
                        <Button asChild variant="outline">
                            <Link
                                href="/feedback360/cycles"
                                className="flex items-center justify-center rounded-xl border border-border bg-gradient-to-r from-pink-200/30 to-yellow-200/30 text-muted-foreground backdrop-blur-sm"
                            >
                                <span className="flex items-center justify-center gap-1 bg-gradient-to-r from-pink-600 to-amber-600 bg-clip-text text-transparent font-medium">
                                    <RefreshCw className="h-4 w-4 text-pink-500" />
                                    Manage Cycles
                                </span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="flex items-center justify-center rounded-xl border border-border bg-gradient-to-r from-pink-200/30 to-yellow-200/30 text-muted-foreground backdrop-blur-sm"
                        >
                            <Link href="/feedback360/reviews">
                                <span className="flex items-center justify-center gap-1 bg-gradient-to-r from-pink-600 to-amber-600 bg-clip-text text-transparent font-medium">
                                    <NotebookTabs className="h-4 w-4 text-pink-500" />
                                    Manage Reviews
                                </span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="flex items-center justify-center rounded-xl border border-border bg-gradient-to-r from-pink-200/30 to-yellow-200/30 text-muted-foreground backdrop-blur-sm"
                        >
                            <Link href="/feedback360/surveys">
                                <span className="flex items-center justify-center gap-1 bg-gradient-to-r from-pink-600 to-amber-600 bg-clip-text text-transparent font-medium">
                                    <NotebookTabs className="h-4 w-4 text-pink-500" />
                                    Manage Surveys
                                </span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="flex items-center justify-center rounded-xl border border-border bg-gradient-to-r from-pink-200/30 to-yellow-200/30 text-muted-foreground backdrop-blur-sm"
                        >
                            <Link href="/reporting/individual-reports">
                                <span className="flex items-center justify-center gap-1 bg-gradient-to-r from-pink-600 to-amber-600 bg-clip-text text-transparent font-medium">
                                    <FileUser className="h-4 w-4 text-pink-500" />
                                    Individual Reports
                                </span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="flex items-center justify-center rounded-xl border border-border bg-gradient-to-r from-pink-200/30 to-yellow-200/30 text-muted-foreground backdrop-blur-sm"
                        >
                            <Link href="/reporting/strategic-reports">
                                <span className="flex items-center justify-center gap-1 bg-gradient-to-r from-pink-600 to-amber-600 bg-clip-text text-transparent font-medium">
                                    <FileLineChart className="h-4 w-4 text-pink-500" />
                                    Strategic Reports
                                </span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="flex items-center justify-center rounded-xl border border-border bg-gradient-to-r from-pink-200/30 to-yellow-200/30 text-muted-foreground backdrop-blur-sm"
                        >
                            <Link href="/reporting/cluster-score-analytics">
                                <span className="flex items-center justify-center gap-1 bg-gradient-to-r from-pink-600 to-amber-600 bg-clip-text text-transparent font-medium">
                                    <Boxes className="h-4 w-4 text-pink-500" />
                                    Cluster Analytics
                                </span>
                            </Link>
                        </Button>
                    </div>
                )}
            </div>

            {/* Welcome / Profile Card */}
            <Card className="border-border p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                    <div className="flex flex-row items-center gap-4">
                        <Avatar className="h-30 w-30 border bg-muted shrink-0">
                            <AvatarImage
                                src={user.avatarUrl || ''}
                                alt={user.fullName}
                                className="object-cover"
                            />
                            <AvatarFallback className="text-6xl font-medium text-muted-foreground bg-neutral-100">
                                {getUserInitialsFromFullName(user.fullName)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-3 min-w-0">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground break-words">
                                {user.fullName}
                            </h1>
                            <div className="flex flex-row items-center gap-x-2 text-base text-muted-foreground flex-wrap">
                                <span className="break-words">
                                    {user.positionTitle || '—'}
                                </span>
                                {user.teamTitle && (
                                    <>
                                        <span>•</span>
                                        <span className="break-words">
                                            {user.teamTitle}
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                {user.roles.sort().map((role) => (
                                    <RoleBadge key={role} role={role} />
                                ))}
                            </div>
                        </div>
                    </div>
                    {currentCycle && (
                        <div className="flex flex-col gap-3 text-base sm:text-right">
                            <div className="flex items-center gap-2 sm:justify-end flex-wrap">
                                <CycleStageBadge stage={currentCycle.stage} />
                                <span className="font-medium text-foreground break-words">
                                    {currentCycle.title}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 sm:justify-end text-muted-foreground flex-wrap">
                                <Calendar className="shrink-0 h-4 w-4" />
                                <span className="whitespace-nowrap">
                                    {format(
                                        currentCycle.startDate,
                                        'MMM dd, yyyy',
                                    )}{' '}
                                    –{' '}
                                    {format(
                                        currentCycle.endDate,
                                        'MMM dd, yyyy',
                                    )}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Stat cards (role-aware values) */}
            <div className="flex flex-row flex-wrap w-full gap-3 sm:gap-4 md:gap-6 justify-around">
                <StatisticsCard
                    title={`Active Cycles`}
                    value={formatNumber(activeCycles.length) ?? '-'}
                    icon={RefreshCw}
                    color="text-amber-300"
                    width={250}
                />
                <StatisticsCard
                    title={
                        showAdmin
                            ? `Reviews in Cycle`
                            : showManager
                              ? `My Team Reviews`
                              : `My Reviews`
                    }
                    value={
                        formatNumber(
                            showAdmin
                                ? currentCycleReviews.length
                                : showManager
                                  ? teamReviews.length
                                  : myReviews.length,
                        ) ?? '-'
                    }
                    icon={NotebookTabs}
                    color="text-blue-300"
                    width={250}
                />
                <StatisticsCard
                    title={
                        showAdmin
                            ? `Individual Reports`
                            : showManager
                              ? `My Team Reports`
                              : `My Reports`
                    }
                    value={
                        formatNumber(
                            showAdmin
                                ? allIndividualReports.length
                                : showManager
                                  ? teamIndividualReports.length
                                  : myIndividualReports.length,
                        ) ?? '-'
                    }
                    icon={FileUser}
                    color="text-lime-300"
                    width={250}
                />
                {showEmployee ? (
                    <StatisticsCard
                        title={`Cycle Progress`}
                        value={`${cycleProgressPct}%`}
                        icon={TrendingUp}
                        color="text-purple-300"
                        width={250}
                    />
                ) : (
                    <StatisticsCard
                        title={`Strategic Reports`}
                        value={
                            formatNumber(currentCycleStrategicReports.length) ??
                            '-'
                        }
                        icon={BarChart3}
                        color="text-purple-300"
                        width={250}
                    />
                )}
            </div>

            {/* Current Cycle Progress (admin/HR/manager) */}
            {currentCycle && !showEmployee && (
                <Card className="border-border p-4 sm:p-6">
                    <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-foreground text-lg break-words">
                            Current Cycle Progress
                        </CardTitle>
                        <CardDescription className="text-base">
                            <span className="font-semibold text-foreground">
                                {reviewsFinished.length}
                            </span>{' '}
                            of{' '}
                            <span className="font-semibold text-foreground">
                                {currentCycleReviews.length}
                            </span>{' '}
                            reviews completed in {currentCycle.title}.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 flex flex-col gap-2">
                        <Progress
                            value={cycleProgressPct}
                            className="w-full max-w-full rounded-full"
                        />
                        <div className="flex flex-row flex-wrap gap-x-4 gap-y-1 text-base text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                                <Hourglass className="h-4 w-4 text-amber-500" />
                                {reviewsInProgress.length} in progress
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <SquareCheck className="h-4 w-4 text-green-500" />
                                {reviewsFinished.length} finished
                            </span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* My Reviews (everyone) */}
            <Card className="border-border p-4 sm:p-6">
                <CardHeader className="p-0 mb-4 flex flex-row items-start justify-between gap-2 flex-wrap">
                    <div className="min-w-0">
                        <CardTitle className="text-foreground text-lg break-words">
                            My Reviews
                        </CardTitle>
                        <CardDescription className="text-base">
                            {myReviews.length === 0
                                ? 'You currently have no reviews in the active cycle.'
                                : `You are the ratee for ${myReviews.length} review${myReviews.length === 1 ? '' : 's'} in the current cycle.`}
                        </CardDescription>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/feedback360/reviews">
                            View all
                            <Eye className="ml-1 h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="space-y-3">
                        {myReviews.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                No reviews assigned to you in the current cycle.
                            </div>
                        ) : (
                            myReviews.slice(0, 5).map((review) => (
                                <Link
                                    key={review.id}
                                    href={`/feedback360/reviews/${review.id}`}
                                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition"
                                >
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <span className="font-medium text-foreground break-words">
                                            Review #{review.id}
                                        </span>
                                        <span className="text-muted-foreground text-sm break-words">
                                            {review.rateePositionTitle}
                                            {review.teamTitle &&
                                                ` • ${review.teamTitle}`}
                                        </span>
                                    </div>
                                    <ReviewStageBadge stage={review.stage} />
                                </Link>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Team / All Reviews (manager / admin / HR) */}
            {!showEmployee && (
                <Card className="border-border p-4 sm:p-6">
                    <CardHeader className="p-0 mb-4 flex flex-row items-start justify-between gap-2 flex-wrap">
                        <div className="min-w-0">
                            <CardTitle className="text-foreground text-lg break-words">
                                {showAdmin
                                    ? 'Reviews in Current Cycle'
                                    : 'My Team Reviews'}
                            </CardTitle>
                            <CardDescription className="text-base">
                                {showAdmin
                                    ? `${currentCycleReviews.length} review${currentCycleReviews.length === 1 ? '' : 's'} across the organization.`
                                    : `${teamReviews.length} review${teamReviews.length === 1 ? '' : 's'} for your team in the current cycle.`}
                            </CardDescription>
                        </div>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/feedback360/reviews">
                                View all
                                <Eye className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="space-y-3">
                            {teamReviewsList.length === 0 ? (
                                <div className="py-8 text-center text-muted-foreground">
                                    No reviews to display.
                                </div>
                            ) : (
                                teamReviewsList.slice(0, 5).map((review) => (
                                    <Link
                                        key={review.id}
                                        href={`/feedback360/reviews/${review.id}`}
                                        className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition"
                                    >
                                        <div className="flex flex-col gap-1 min-w-0">
                                            <span className="font-medium text-foreground break-words">
                                                {review.rateeFullName}
                                            </span>
                                            <span className="text-muted-foreground text-sm break-words">
                                                {review.rateePositionTitle}
                                                {review.teamTitle &&
                                                    ` • ${review.teamTitle}`}
                                            </span>
                                        </div>
                                        <ReviewStageBadge
                                            stage={review.stage}
                                        />
                                    </Link>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* My Reports (everyone) */}
            <Card className="border-border p-4 sm:p-6">
                <CardHeader className="p-0 mb-4 flex flex-row items-start justify-between gap-2 flex-wrap">
                    <div className="min-w-0">
                        <CardTitle className="text-foreground text-lg break-words">
                            My Reports
                        </CardTitle>
                        <CardDescription className="text-base">
                            {myIndividualReports.length} individual report
                            {myIndividualReports.length === 1 ? '' : 's'} about
                            you.
                        </CardDescription>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/reporting/individual-reports">
                            View all
                            <Eye className="ml-1 h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="space-y-3">
                        {myIndividualReports.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                No individual reports about you yet.
                            </div>
                        ) : (
                            myIndividualReports.slice(0, 5).map((report) => (
                                <Link
                                    key={report.id}
                                    href={`/reporting/individual-reports/${report.id}`}
                                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition"
                                >
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <span className="font-medium text-foreground">
                                            Report #{report.id}
                                        </span>
                                        <span className="text-muted-foreground text-sm">
                                            {report.respondentCount ?? 0}{' '}
                                            respondents •{' '}
                                            {report.answerCount ?? 0} answers
                                        </span>
                                    </div>
                                    <span className="text-muted-foreground text-sm whitespace-nowrap">
                                        {format(
                                            report.createdAt,
                                            'MMM dd, yyyy',
                                        )}
                                    </span>
                                </Link>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Strategic Reports (admin/HR/manager) */}
            {!showEmployee && (
                <Card className="border-border p-4 sm:p-6">
                    <CardHeader className="p-0 mb-4 flex flex-row items-start justify-between gap-2 flex-wrap">
                        <div className="min-w-0">
                            <CardTitle className="text-foreground text-lg break-words">
                                Strategic Reports
                            </CardTitle>
                            <CardDescription className="text-base">
                                {currentCycleStrategicReports.length} report
                                {currentCycleStrategicReports.length === 1
                                    ? ''
                                    : 's'}{' '}
                                for the current cycle.
                            </CardDescription>
                        </div>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/reporting/strategic-reports">
                                View all
                                <Eye className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="space-y-3">
                            {currentCycleStrategicReports.length === 0 ? (
                                <div className="py-8 text-center text-muted-foreground">
                                    No strategic reports for the current cycle.
                                </div>
                            ) : (
                                currentCycleStrategicReports
                                    .slice(0, 5)
                                    .map((report) => (
                                        <Link
                                            key={report.id}
                                            href={`/reporting/strategic-reports/${report.id}`}
                                            className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition"
                                        >
                                            <div className="flex flex-col gap-1 min-w-0">
                                                <span className="font-medium text-foreground break-words">
                                                    {report.cycleTitle}
                                                </span>
                                                <span className="text-muted-foreground text-sm">
                                                    {report.respondentCount ??
                                                        0}{' '}
                                                    respondents •{' '}
                                                    {report.answerCount ?? 0}{' '}
                                                    answers
                                                </span>
                                            </div>
                                            <span className="text-muted-foreground text-sm whitespace-nowrap">
                                                {format(
                                                    report.createdAt,
                                                    'MMM dd, yyyy',
                                                )}
                                            </span>
                                        </Link>
                                    ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
