'use client';

import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import {
    AlarmClock,
    Archive,
    Eye,
    FilePlus2,
    FileUser,
    Hourglass,
    MessageCircle,
    Pencil,
    SquareCheck,
    UserRound,
} from 'lucide-react';
import Link from 'next/link';

import { useCyclesQuery } from '@entities/feedback360/cycle/api/cycle.queries';
import { CycleStage } from '@entities/feedback360/cycle/model/types';
import {
    useReviewAnswersCountsQuery,
    useReviewCycleTitlesQuery,
    useReviewQuestionCountsQuery,
    useReviewRespondentCountsQuery,
    useReviewReviewerCountsQuery,
    useReviewsQuery,
} from '@entities/feedback360/review/api/review.queries';
import type { Review } from '@entities/feedback360/review/model/mappers';
import {
    REVIEW_STAGE_ENUM_VALUES,
    ReviewStage,
    SortDirection,
} from '@entities/feedback360/review/model/types';
import { ReviewsFilters } from '@entities/feedback360/review/ui/reviews-filters';
import { ReviewsTable } from '@entities/feedback360/review/ui/reviews-table';
import {
    StageBadge,
    stageConfig,
} from '@entities/feedback360/review/ui/stage-badge';
import { useUsersByUserIdsQuery } from '@entities/identity/user/api/user.queries';
import { type AuthContextType } from '@entities/identity/user/model/types';
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
import { Spinner } from '@shared/components/ui/spinner';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@shared/components/ui/tabs';
import { formatNumber } from '@shared/lib/utils/format-number';
import { getUserInitialsFromFullName } from '@shared/lib/utils/get-user-initials-from-full-name';
import { StatisticsCard } from '@shared/ui/statistics-card';
import { TablePagination } from '@shared/ui/table-pagination';

const ITEMS_PER_PAGE = 6;

export function ReviewsList({ currentUser }: { currentUser: AuthContextType }) {
    const [search, setSearch] = useState('');
    const [stages, setStages] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        undefined,
    );
    const [cycles, setCycles] = useState<string[]>([]);
    const [teams, setTeams] = useState<string[]>([]);
    const [positions, setPositions] = useState<string[]>([]);
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        SortDirection.DESC,
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [resetTrigger, setResetTrigger] = useState(0);
    const [activeTab, setActiveTab] = useState<ReviewStage>(
        ReviewStage.IN_PROGRESS,
    );

    // Feature dialogs state
    const [forceFinishReview, setForceFinishReview] = useState<Review | null>(
        null,
    );
    const [deleteReview, setDeleteReview] = useState<Review | null>(null);

    const { data: reviews = [], isLoading, isError } = useReviewsQuery();
    const { data: allReviewsData = [] } = useReviewsQuery();
    const { data: allCycles = [] } = useCyclesQuery();

    // Filter unique teams and positions
    const teamOptions = useMemo(() => {
        const uniqueTeams = new Map<number, { id: number; title: string }>();

        allReviewsData.forEach((r) => {
            if (r.teamId && r.teamTitle && r.teamTitle.trim() !== '') {
                uniqueTeams.set(r.teamId, {
                    id: r.teamId,
                    title: r.teamTitle,
                });
            }
        });

        return Array.from(uniqueTeams.values()).sort((a, b) =>
            a.title.localeCompare(b.title),
        );
    }, [allReviewsData]);

    const positionOptions = useMemo(() => {
        const uniquePositions = new Map<
            number,
            { id: number; title: string }
        >();

        allReviewsData.forEach((r) => {
            if (
                r.rateePositionId &&
                r.rateePositionTitle &&
                r.rateePositionTitle.trim() !== ''
            ) {
                uniquePositions.set(r.rateePositionId, {
                    id: r.rateePositionId,
                    title: r.rateePositionTitle,
                });
            }
        });

        return Array.from(uniquePositions.values()).sort((a, b) =>
            a.title.localeCompare(b.title),
        );
    }, [allReviewsData]);

    // Fetch question, answer, respondent and reviewer counts for all reviews
    const reviewIds = useMemo(
        () => allReviewsData.map((r) => r.id),
        [allReviewsData],
    );
    const cycleIds = useMemo(
        () =>
            allReviewsData
                .map((r) => r.cycleId)
                .filter((id): id is number => id !== null && id !== undefined),
        [allReviewsData],
    );
    const { questionCounts, isLoading: isQuestionCountsLoading } =
        useReviewQuestionCountsQuery(reviewIds);
    const { answerCounts, isLoading: isAnswerCountsLoading } =
        useReviewAnswersCountsQuery(reviewIds);
    const { respondentCounts, isLoading: isRespondentCountsLoading } =
        useReviewRespondentCountsQuery(reviewIds);
    const { reviewerCounts, isLoading: isReviewerCountsLoading } =
        useReviewReviewerCountsQuery(reviewIds);
    const { cycleTitles, isLoading: isCycleTitlesLoading } =
        useReviewCycleTitlesQuery(reviewIds, cycleIds);

    // Ratee users for dashboard cards
    const rateeIds = useMemo(
        () => Array.from(new Set(allReviewsData.map((r) => r.rateeId))),
        [allReviewsData],
    );
    const { data: rateeUsers = [] } = useUsersByUserIdsQuery(rateeIds);
    const rateeUserById = useMemo(
        () => new Map(rateeUsers.map((u) => [u.id, u])),
        [rateeUsers],
    );

    const currentCycles = useMemo(() => {
        return allCycles.filter((c) => c.stage === CycleStage.ACTIVE);
    }, [allCycles]);

    const currentCycleIds = useMemo(() => {
        return currentCycles.map((c) => c.id);
    }, [currentCycles]);

    // Bucket all reviews by stage for the dashboard
    const reviewsByStage = useMemo(() => {
        const buckets = Object.fromEntries(
            REVIEW_STAGE_ENUM_VALUES.map((s) => [s, [] as Review[]]),
        ) as Record<ReviewStage, Review[]>;
        allReviewsData
            .filter((r) => currentCycleIds.includes(r.cycleId || -1))
            .filter((r) => {
                if (currentUser.isAdmin || currentUser.isHR) {
                    return r;
                }
                if (currentUser.isManager) {
                    return r.managerId === currentUser.user.id ||
                        r.rateeId === currentUser.user.id
                        ? r
                        : null;
                }
                if (currentUser.isEmployee) {
                    return r.rateeId === currentUser.user.id ? r : null;
                }
                return null;
            })
            .filter((r): r is Review => r !== null)
            .sort((a, b) => a.id - b.id)
            .forEach((r) => {
                if (r.stage && buckets[r.stage]) buckets[r.stage].push(r);
            });
        return buckets;
    }, [allReviewsData, currentCycleIds]);

    console.log('allReviewsData', allReviewsData);
    console.log('currentCycles', currentCycles);
    console.log('reviewsByStage', reviewsByStage);

    const cycleOptions = useMemo(() => {
        const titles = new Set(
            Object.values(cycleTitles).filter(
                (title) => title && title.trim() !== '',
            ),
        );

        const hasNoCycleReviews = allReviewsData.some(
            (r) => r.cycleId === null || r.cycleId === undefined,
        );

        const sortedTitles = Array.from(titles).sort();
        if (hasNoCycleReviews) {
            sortedTitles.push('None');
        }

        return sortedTitles;
    }, [cycleTitles, allReviewsData]);

    const stageOptions = useMemo(() => {
        const stages = new Set(
            allReviewsData.map((r) => r.stage).filter(Boolean),
        );

        const sortedStages = Array.from(stages).sort((a, b) => {
            return (
                REVIEW_STAGE_ENUM_VALUES.indexOf(a) -
                REVIEW_STAGE_ENUM_VALUES.indexOf(b)
            ); // ascending order
        });

        return sortedStages;
    }, [allReviewsData]);

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection((prev) =>
                prev === SortDirection.ASC
                    ? SortDirection.DESC
                    : SortDirection.ASC,
            );
        } else {
            setSortField(field);
            setSortDirection(SortDirection.ASC);
        }
        setCurrentPage(1);
    };

    const handleReset = () => {
        setSearch('');
        setStages([]);
        setDateRange(undefined);
        setCycles([]);
        setTeams([]);
        setPositions([]);
        setSortField('createdAt');
        setSortDirection(SortDirection.DESC);
        setCurrentPage(1);
        setResetTrigger((prev) => prev + 1);
    };

    // Client-side filtering for date range and cycle title
    const filteredReviews = useMemo(() => {
        let result = reviews;

        if (search.trim()) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(
                (c) =>
                    c.id.toString().includes(lowerSearch) ||
                    (c.rateeFullName &&
                        c.rateeFullName.toLowerCase().includes(lowerSearch)),
            );
        }

        if (dateRange?.from) {
            const from = dateRange.from.getTime();
            result = result.filter((c) => c.createdAt.getTime() >= from);
        }
        if (dateRange?.to) {
            const to = dateRange.to.getTime();
            result = result.filter((c) => c.createdAt.getTime() <= to);
        }

        if (stages.length > 0) {
            result = result.filter((c) => c.stage && stages.includes(c.stage));
        }

        if (cycles.length > 0) {
            result = result.filter((c) => {
                const title =
                    c.cycleId === null || c.cycleId === undefined
                        ? 'None'
                        : (cycleTitles[c.cycleId!] ?? '');
                return cycles.includes(title);
            });
        }

        if (teams.length > 0) {
            result = result.filter(
                (c) => c.teamId !== null && teams.includes(String(c.teamId)),
            );
        }

        if (positions.length > 0) {
            result = result.filter(
                (c) =>
                    c.rateePositionId !== null &&
                    positions.includes(String(c.rateePositionId)),
            );
        }

        return result;
    }, [
        reviews,
        search,
        dateRange,
        stages,
        cycles,
        cycleTitles,
        teams,
        positions,
    ]);

    // Client-side sorting for all fields
    const sortedReviews = useMemo(() => {
        return [...filteredReviews].sort((a, b) => {
            switch (sortField) {
                case 'id':
                    return sortDirection === SortDirection.ASC
                        ? a.id - b.id
                        : b.id - a.id;
                case 'title':
                    return sortDirection === SortDirection.ASC
                        ? (a.rateeFullName ?? '').localeCompare(
                              b.rateeFullName ?? '',
                          )
                        : (b.rateeFullName ?? '').localeCompare(
                              a.rateeFullName ?? '',
                          );
                case 'cycleTitle': {
                    const titleA = a.cycleId
                        ? (cycleTitles[a.cycleId] ?? '')
                        : '';
                    const titleB = b.cycleId
                        ? (cycleTitles[b.cycleId] ?? '')
                        : '';
                    return sortDirection === SortDirection.ASC
                        ? titleA.localeCompare(titleB)
                        : titleB.localeCompare(titleA);
                }
                case 'createdAt':
                    return sortDirection === SortDirection.ASC
                        ? a.createdAt?.getTime() - b.createdAt?.getTime()
                        : b.createdAt?.getTime() - a.createdAt?.getTime();
                case 'questionCount': {
                    const countA = questionCounts[a.id] ?? 0;
                    const countB = questionCounts[b.id] ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                case 'stage': {
                    const indexA = REVIEW_STAGE_ENUM_VALUES.indexOf(a.stage);
                    const indexB = REVIEW_STAGE_ENUM_VALUES.indexOf(b.stage);
                    return sortDirection === SortDirection.ASC
                        ? indexA - indexB
                        : indexB - indexA;
                }
                case 'respondentCount': {
                    const countA = respondentCounts[a.id] ?? 0;
                    const countB = respondentCounts[b.id] ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                case 'answerCount': {
                    const countA = answerCounts[a.id] ?? 0;
                    const countB = answerCounts[b.id] ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                case 'reviewerCount': {
                    const countA = reviewerCounts[a.id] ?? 0;
                    const countB = reviewerCounts[b.id] ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                default:
                    return 0;
            }
        });
    }, [
        filteredReviews,
        sortField,
        sortDirection,
        cycleTitles,
        questionCounts,
        answerCounts,
        respondentCounts,
        reviewerCounts,
    ]);

    const totalPages = Math.ceil(sortedReviews.length / ITEMS_PER_PAGE);
    const paginatedReviews = sortedReviews.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    // Summary stats
    const activeReviews = reviews.filter(
        (c) =>
            c.stage === ReviewStage.SELF_ASSESSMENT ||
            c.stage === ReviewStage.WAITING_TO_START ||
            c.stage === ReviewStage.IN_PROGRESS ||
            c.stage === ReviewStage.PREPARING_REPORT ||
            c.stage === ReviewStage.PROCESSING_BY_HR,
    ).length;
    const totalReviews = reviews.length;

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-8xl gap-8 flex flex-col">
                {/* Reviews Dashboard Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">
                            360° Feedback Reviews Dashboard
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Overview of reviews across all stages. You have{' '}
                            <span className="font-medium text-foreground">
                                {reviewsByStage[ReviewStage.WAITING_TO_START]
                                    .length +
                                    reviewsByStage[ReviewStage.IN_PROGRESS]
                                        .length}
                            </span>{' '}
                            reviews in progress.
                        </p>
                    </div>
                </div>

                {/* Review stats */}
                <div className="flex flex-row flex-wrap flex-1 min-w-[95px] w-full overflow-hidden gap-6 justify-around items-center">
                    {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full lg:grid-flow-col lg:grid-rows-2 place-content-center"> */}
                    <StatisticsCard
                        title={`New`}
                        value={
                            formatNumber(
                                reviewsByStage[ReviewStage.NEW].length,
                            ) ?? '-'
                        }
                        icon={FilePlus2}
                        textColor="text-blue-300"
                        width={235}
                    />
                    <StatisticsCard
                        title={`Self-assessment`}
                        value={
                            formatNumber(
                                reviewsByStage[ReviewStage.SELF_ASSESSMENT]
                                    .length,
                            ) ?? '-'
                        }
                        icon={UserRound}
                        textColor="text-teal-300"
                        width={235}
                    />
                    <StatisticsCard
                        title={`In Progress`}
                        value={
                            formatNumber(
                                reviewsByStage[ReviewStage.WAITING_TO_START]
                                    .length +
                                    reviewsByStage[ReviewStage.IN_PROGRESS]
                                        .length,
                            ) ?? '-'
                        }
                        icon={Hourglass}
                        textColor="text-amber-300"
                        width={235}
                    />
                    <StatisticsCard
                        title={`Finished`}
                        value={
                            formatNumber(
                                reviewsByStage[ReviewStage.FINISHED].length +
                                    reviewsByStage[ReviewStage.PREPARING_REPORT]
                                        .length +
                                    reviewsByStage[ReviewStage.PROCESSING_BY_HR]
                                        .length,
                            ) ?? '-'
                        }
                        icon={SquareCheck}
                        textColor="text-purple-300"
                        width={235}
                    />
                    <StatisticsCard
                        title={`Published`}
                        value={
                            formatNumber(
                                reviewsByStage[ReviewStage.PUBLISHED].length +
                                    reviewsByStage[ReviewStage.ANALYSIS].length,
                            ) ?? '-'
                        }
                        icon={FileUser}
                        textColor="text-lime-300"
                        width={235}
                    />
                    <StatisticsCard
                        title={`Archived`}
                        value={
                            formatNumber(
                                reviewsByStage[ReviewStage.ARCHIVED].length +
                                    reviewsByStage[ReviewStage.CANCELED].length,
                            ) ?? '-'
                        }
                        icon={Archive}
                        textColor="text-zinc-300"
                        width={235}
                    />
                </div>

                {/* Review List Tabs */}
                <Tabs
                    value={activeTab}
                    onValueChange={(v) => setActiveTab(v as ReviewStage)}
                    className="w-full overflow-hidden"
                >
                    <TabsList className="flex flex-wrap h-auto justify-start gap-1 overflow-x-auto border rounded-xl">
                        {REVIEW_STAGE_ENUM_VALUES.map((stage) => (
                            <TabsTrigger
                                key={stage}
                                value={stage}
                                className="border rounded-xl"
                            >
                                {stageConfig[stage].label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {REVIEW_STAGE_ENUM_VALUES.map((stage) => (
                        <TabsContent key={stage} value={stage}>
                            <Card className="bg-card border-border">
                                <CardHeader>
                                    <CardTitle className="text-foreground">
                                        {stageConfig[stage].label} Reviews
                                    </CardTitle>
                                    <CardDescription>
                                        A total of{' '}
                                        <span className="font-semibold text-foreground">
                                            {reviewsByStage[stage].length}
                                        </span>{' '}
                                        {reviewsByStage[stage].length !== 1
                                            ? 'reviews are'
                                            : 'review is'}{' '}
                                        currently at the{' '}
                                        {stageConfig[stage].label} stage.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {reviewsByStage[stage].length === 0 ? (
                                            <div className="py-12 text-center text-muted-foreground">
                                                No reviews in this stage
                                            </div>
                                        ) : (
                                            reviewsByStage[stage].map(
                                                (review) => {
                                                    const ratee =
                                                        rateeUserById.get(
                                                            review.rateeId,
                                                        );
                                                    const cycle =
                                                        currentCycles.find(
                                                            (c) =>
                                                                c.id ===
                                                                review.cycleId,
                                                        );
                                                    return (
                                                        <div
                                                            key={review.id}
                                                            className="flex flex-row flex-wrap items-center justify-between gap-6 p-4 rounded-xl border border-border shadow-xs w-full overflow-hidden"
                                                        >
                                                            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left flex-1 min-w-[400px]">
                                                                <Avatar className="h-20 w-20 border bg-muted shrink-0">
                                                                    <AvatarImage
                                                                        className="object-cover"
                                                                        src={
                                                                            ratee?.avatarUrl ||
                                                                            ''
                                                                        }
                                                                        alt={
                                                                            review.rateeFullName
                                                                        }
                                                                    />
                                                                    <AvatarFallback className="text-4xl font-medium text-muted-foreground bg-neutral-100">
                                                                        {getUserInitialsFromFullName(
                                                                            review.rateeFullName,
                                                                        )}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="space-y-1 flex-1 min-w-0">
                                                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                                                        <p className="font-medium text-lg text-foreground break-words">
                                                                            {
                                                                                review.rateeFullName
                                                                            }
                                                                        </p>
                                                                        <StageBadge
                                                                            stage={
                                                                                review.stage
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 text-muted-foreground text-base">
                                                                        <span className="break-words">
                                                                            {
                                                                                review.rateePositionTitle
                                                                            }
                                                                        </span>
                                                                        {review.teamTitle && (
                                                                            <>
                                                                                <span className="sm:inline">
                                                                                    •
                                                                                </span>
                                                                                <span className="break-words">
                                                                                    {
                                                                                        review.teamTitle
                                                                                    }
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <Progress
                                                                value={
                                                                    ((answerCounts[
                                                                        review
                                                                            .id
                                                                    ] ?? 0) /
                                                                        (respondentCounts[
                                                                            review
                                                                                .id
                                                                        ] ??
                                                                            0)) *
                                                                    100
                                                                }
                                                                className="w-[200px]"
                                                            />

                                                            <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 shrink-0 w-full md:w-auto flex-wrap">
                                                                <div className="flex items-center gap-x-1 text-base flex-wrap justify-center lg:justify-end">
                                                                    <MessageCircle className="shrink-0 h-4 w-4 text-muted-foreground" />
                                                                    <span className="font-medium text-foreground whitespace-nowrap gap-1 flex">
                                                                        {answerCounts[
                                                                            review
                                                                                .id
                                                                        ] ?? 0}
                                                                        <span className="text-muted-foreground">
                                                                            /
                                                                        </span>
                                                                        {respondentCounts[
                                                                            review
                                                                                .id
                                                                        ] ?? 0}
                                                                    </span>
                                                                    <span className="text-muted-foreground whitespace-nowrap">
                                                                        collected
                                                                        answers
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-x-2 text-base flex-wrap justify-center lg:justify-end">
                                                                    <AlarmClock className="shrink-0 h-4 w-4 text-muted-foreground" />
                                                                    <span className="text-muted-foreground whitespace-nowrap">
                                                                        Due
                                                                    </span>
                                                                    <span className="font-medium text-foreground whitespace-nowrap">
                                                                        {format(
                                                                            cycle?.responseDeadline ||
                                                                                cycle?.reviewDeadline ||
                                                                                cycle?.endDate ||
                                                                                '',
                                                                            'MMM dd, yyyy',
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <Button
                                                                    asChild
                                                                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl w-full sm:w-auto"
                                                                >
                                                                    <Link
                                                                        href={`/feedback360/reviews/${review.id}`}
                                                                    >
                                                                        {currentUser.isAdmin ||
                                                                        currentUser.isHR ? (
                                                                            <Pencil className="h-4 w-4" />
                                                                        ) : (
                                                                            <Eye className="h-4 w-4" />
                                                                        )}
                                                                        {currentUser.isAdmin ||
                                                                        currentUser.isHR
                                                                            ? 'Edit'
                                                                            : 'View'}
                                                                    </Link>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    );
                                                },
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>

                {/* Table Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">
                            360° Feedback Reviews Table
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage and monitor reviews across your organization.{' '}
                            <span className="font-medium text-foreground">
                                {activeReviews}
                            </span>{' '}
                            active of{' '}
                            <span className="font-medium text-foreground">
                                {totalReviews}
                            </span>{' '}
                            total reviews.
                        </p>
                    </div>
                    {/* <CreateReviewForm
                        trigger={
                            <Button size="lg" className="shrink-0">
                                <Plus className="mr-2 h-4 w-4" />
                                Create New Review
                            </Button>
                        }
                    /> */}
                </div>

                {/* Main Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">All Reviews</CardTitle>
                        <CardDescription>
                            Search, filter, and manage reviews.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        {/* Filters */}
                        <ReviewsFilters
                            search={search}
                            onSearchChange={(val) => {
                                setSearch(val);
                                setCurrentPage(1);
                            }}
                            stages={stages}
                            onStagesChange={(val) => {
                                setStages(val);
                                setCurrentPage(1);
                            }}
                            dateRange={dateRange}
                            onDateRangeChange={(range) => {
                                setDateRange(range);
                                setCurrentPage(1);
                            }}
                            cycles={cycles}
                            onCyclesChange={(val) => {
                                setCycles(val);
                                setCurrentPage(1);
                            }}
                            teams={teams}
                            onTeamsChange={(val) => {
                                setTeams(val);
                                setCurrentPage(1);
                            }}
                            positions={positions}
                            onPositionsChange={(val) => {
                                setPositions(val);
                                setCurrentPage(1);
                            }}
                            stageOptions={stageOptions}
                            cycleOptions={cycleOptions}
                            teamOptions={teamOptions}
                            positionOptions={positionOptions}
                            onReset={handleReset}
                        />

                        {/* Loading State */}
                        {(isLoading ||
                            isQuestionCountsLoading ||
                            isAnswerCountsLoading ||
                            isRespondentCountsLoading ||
                            isReviewerCountsLoading ||
                            isCycleTitlesLoading) && (
                            <div className="flex flex-col text-center items-center justify-center py-16 h-8 w-8 animate-spin text-muted-foreground">
                                <Spinner />
                            </div>
                        )}

                        {/* Error State */}
                        {isError && (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <h3 className="text-lg font-semibold text-destructive">
                                    Failed to load reviews
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Please try refreshing the page.
                                </p>
                            </div>
                        )}

                        {/* Table */}
                        {!isLoading &&
                            !isError &&
                            !isQuestionCountsLoading &&
                            !isAnswerCountsLoading &&
                            !isRespondentCountsLoading &&
                            !isReviewerCountsLoading &&
                            !isCycleTitlesLoading && (
                                <>
                                    <ReviewsTable
                                        reviews={paginatedReviews}
                                        cycleTitles={cycleTitles}
                                        questionCounts={questionCounts}
                                        answerCounts={answerCounts}
                                        respondentCounts={respondentCounts}
                                        reviewerCounts={reviewerCounts}
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                        onForceFinish={setForceFinishReview}
                                        onDelete={setDeleteReview}
                                        resetTrigger={resetTrigger}
                                    />

                                    {/* Pagination */}
                                    <TablePagination
                                        entityName="reviews"
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        totalItems={filteredReviews.length}
                                        limit={ITEMS_PER_PAGE}
                                        onPageChange={setCurrentPage}
                                    />
                                </>
                            )}
                    </CardContent>
                </Card>
            </div>

            {/* Feature Dialogs */}
            {/* <ForceFinishCycleDialog
                cycle={forceFinishCycle}
                onClose={() => setForceFinishCycle(null)}
            />
            <DeleteCycleDialog
                cycle={deleteCycle}
                onClose={() => setDeleteCycle(null)}
            /> */}
        </main>
    );
}
