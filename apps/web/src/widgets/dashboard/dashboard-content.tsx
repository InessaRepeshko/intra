'use client';

import { CycleStage } from '@entities/feedback360/cycle/model/types';
import { useAuth } from '@entities/identity/user/model/auth-context';
import { mockCycles, mockReviews, mockUsers } from '@lib/mock-data';
import { Button } from '@shared/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import { Progress } from '@shared/components/ui/progress';
import { PageHeader } from '@shared/ui/page-header';
import { StatusBadge } from '@shared/ui/status-badge';
import {
    AlertCircle,
    ArrowRight,
    Clock,
    NotebookTabs,
    RefreshCw,
    TrendingUp,
    Users,
} from 'lucide-react';
import Link from 'next/link';

export function ProfileContent() {
    const { user, isHR, isAdmin } = useAuth();

    const activeCycles = mockCycles.filter(
        (c) => c.stage === CycleStage.ACTIVE,
    );
    const activeReviews = mockReviews.filter(
        (r) => r.stage !== 'PROCESSING_BY_HR',
    );
    const completedReviews = mockReviews.filter(
        (r) => r.stage === 'PROCESSING_BY_HR',
    );
    const totalRespondents = mockReviews.reduce(
        (acc, r) => acc + (r.respondentsCount || 0),
        0,
    );
    const totalResponded = mockReviews.reduce(
        (acc, r) => acc + (r.respondedCount || 0),
        0,
    );
    const avgTurnout =
        totalRespondents > 0
            ? Math.round((totalResponded / totalRespondents) * 100)
            : 0;

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title={`Welcome back, ${user.firstName}!`}
                description="Here is an overview of your 360 feedback platform."
            />

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <RefreshCw className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Active Cycles
                                </p>
                                <p className="text-2xl font-bold text-foreground">
                                    {activeCycles.length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                                <NotebookTabs className="h-6 w-6 text-chart-2" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Active Reviews
                                </p>
                                <p className="text-2xl font-bold text-foreground">
                                    {activeReviews.length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                                <TrendingUp className="h-6 w-6 text-success" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Avg Turnout
                                </p>
                                <p className="text-2xl font-bold text-foreground">
                                    {avgTurnout}%
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-5/10">
                                <Users className="h-6 w-6 text-chart-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Users
                                </p>
                                <p className="text-2xl font-bold text-foreground">
                                    {mockUsers.length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Reviews */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base font-semibold">
                            Recent Reviews
                        </CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/feedback360/reviews">
                                View all
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-3">
                            {mockReviews.slice(0, 5).map((review) => (
                                <Link
                                    key={review.id}
                                    href={`/feedback360/reviews/${review.id}`}
                                    className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-foreground">
                                            {review.rateeFullName}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {review.rateePositionTitle} -{' '}
                                            {review.teamTitle}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {review.respondentsCount &&
                                            review.respondentsCount > 0 && (
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Progress
                                                        value={
                                                            ((review.respondedCount ||
                                                                0) /
                                                                review.respondentsCount) *
                                                            100
                                                        }
                                                        className="h-1.5 w-16"
                                                    />
                                                    <span>
                                                        {review.respondedCount}/
                                                        {
                                                            review.respondentsCount
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                        <StatusBadge
                                            status={review.stage as any}
                                        />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Active Cycles */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base font-semibold">
                            Active Cycles
                        </CardTitle>
                        {(isHR || isAdmin) && (
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/feedback360/cycles">
                                    View all
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-3">
                            {mockCycles.map((cycle) => (
                                <Link
                                    key={cycle.id}
                                    href={`/feedback360/cycles/${cycle.id}`}
                                    className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-foreground">
                                            {cycle.title}
                                        </span>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            <span>
                                                {new Date(
                                                    cycle.startDate,
                                                ).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}{' '}
                                                -{' '}
                                                {new Date(
                                                    cycle.endDate,
                                                ).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-muted-foreground">
                                            {cycle.reviewsCount} reviews
                                        </span>
                                        <StatusBadge status={cycle.stage} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            {(isHR || isAdmin) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild>
                                <Link href="/feedback360/cycles/new">
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Create Cycle
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/feedback360/reviews/new">
                                    <NotebookTabs className="mr-2 h-4 w-4" />
                                    Create Review
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/library/questions/new">
                                    <AlertCircle className="mr-2 h-4 w-4" />
                                    Add Question Template
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/users/new">
                                    <Users className="mr-2 h-4 w-4" />
                                    Add User
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
