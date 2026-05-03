'use client';

import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { useReviewsQuery } from '@entities/feedback360/review/api/review.queries';
import {
    useAllSurveyQuestionsQuery,
    useSurveyCycleTitlesQuery,
} from '@entities/feedback360/survey/api/review-question-relation.queries';
import { SurveyData } from '@entities/feedback360/survey/model/mappers';
import {
    AnswerType,
    REVIEW_STAGE_ENUM_VALUES,
    ReviewStage,
    SortDirection,
} from '@entities/feedback360/survey/model/types';
import { SurveysFilters } from '@entities/feedback360/survey/ui/surveys-filters';
import { SurveysTable } from '@entities/feedback360/survey/ui/surveys-table';
import { type AuthContextType } from '@entities/identity/user/model/types';
import {
    Card,
    CardContent,
} from '@shared/components/ui/card';
import { Spinner } from '@shared/components/ui/spinner';
import { TablePagination } from '@shared/ui/table-pagination';

const ITEMS_PER_PAGE = 6;

export function SurveyList({
    currentUser,
}: {
    currentUser: AuthContextType;
}) {
    void currentUser;

    const [search, setSearch] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        undefined,
    );
    const [stages, setStages] = useState<string[]>([]);
    const [cycles, setCycles] = useState<string[]>([]);
    const [teams, setTeams] = useState<string[]>([]);
    const [positions, setPositions] = useState<string[]>([]);
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        SortDirection.DESC,
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [resetTrigger, setResetTrigger] = useState(0);

    const {
        data: initialAllReviewsData = [],
        isLoading: isReviewsLoading,
        isError: isReviewsError,
    } = useReviewsQuery();

    const reviewIds = useMemo(
        () => initialAllReviewsData.map((r) => r.id),
        [initialAllReviewsData],
    );

    const {
        surveyQuestions: allSurveyQuestions,
        isLoading: isAllSurveyQuestionsLoading,
        isError: isAllSurveyQuestionsError,
    } = useAllSurveyQuestionsQuery(reviewIds);

    const surveyReviewIds = useMemo(
        () =>
            Array.from(
                new Set(
                    Object.values(allSurveyQuestions).flatMap((q) =>
                        q.map((q) => q.reviewId),
                    ),
                ),
            ),
        [allSurveyQuestions],
    );

    const allReviewsData = useMemo(
        () =>
            initialAllReviewsData.filter((r) => surveyReviewIds.includes(r.id)),
        [initialAllReviewsData, surveyReviewIds],
    );

    const cycleIds = useMemo(
        () =>
            allReviewsData
                .map((r) => r.cycleId)
                .filter((id): id is number => id !== null && id !== undefined),
        [allReviewsData],
    );

    const {
        cycleTitles: allCycleTitles,
        isLoading: isAllCycleTitlesLoading,
        isError: isAllCycleTitlesError,
    } = useSurveyCycleTitlesQuery(cycleIds);

    // Filter unique teams, positions and cycle titles
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

    const cycleOptions = useMemo(() => {
        const titles = new Set(
            Object.values(allCycleTitles).filter(
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
    }, [allCycleTitles, allReviewsData]);

    const stageOptions = useMemo(() => {
        const stages = new Set(
            allReviewsData.map((r) => r.stage).filter(Boolean),
        );

        const sortedStages = Array.from(stages).sort((a, b) => {
            return (
                REVIEW_STAGE_ENUM_VALUES.indexOf(a) -
                REVIEW_STAGE_ENUM_VALUES.indexOf(b)
            );
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
        setDateRange(undefined);
        setStages([]);
        setCycles([]);
        setTeams([]);
        setPositions([]);
        setSortField('createdAt');
        setSortDirection(SortDirection.DESC);
        setCurrentPage(1);
        setResetTrigger((prev) => prev + 1);
    };

    // Client-side filtering for date range and cycle title
    const filteredSurveys = useMemo(() => {
        let result = allReviewsData.map((review) => {
            const questions = allSurveyQuestions[review.id] ?? [];
            const competenceIds = questions
                .map((q) => q.competenceId)
                .filter((id) => id !== null);
            const uniqueCompetenceIds = [...new Set(competenceIds)];
            const createdAt = questions
                .map((q) => q.createdAt)
                .sort((a, b) => b.getTime() - a.getTime())[0];
            return SurveyData.create({
                reviewId: review.id,
                rateeFullName: review.rateeFullName,
                stage: review.stage,
                cycleId: review.cycleId ?? null,
                cycleTitle: review.cycleId
                    ? allCycleTitles[review.cycleId]
                    : null,
                teamId: review.teamId ?? null,
                teamTitle: review.teamTitle ?? null,
                positionId: review.rateePositionId ?? null,
                positionTitle: review.rateePositionTitle,
                competenceCount: uniqueCompetenceIds.length,
                questionCount: questions.length,
                numericalQuestionCount: questions.filter(
                    (q) => q.answerType === AnswerType.NUMERICAL_SCALE,
                )?.length,
                textQuestionCount: questions.filter(
                    (q) => q.answerType === AnswerType.TEXT_FIELD,
                )?.length,
                createdAt: new Date(createdAt),
            });
        });

        if (search.trim()) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(
                (c) =>
                    c.reviewId.toString().includes(lowerSearch) ||
                    (c.rateeFullName &&
                        c.rateeFullName.toLowerCase().includes(lowerSearch)),
            );
        }

        if (stages.length > 0) {
            result = result.filter((c) => c.stage && stages.includes(c.stage));
        }

        if (dateRange?.from) {
            const from = dateRange.from.getTime();
            result = result.filter((c) => c.createdAt.getTime() >= from);
        }
        if (dateRange?.to) {
            const to = dateRange.to.getTime();
            result = result.filter((c) => c.createdAt.getTime() <= to);
        }

        if (cycles.length > 0) {
            result = result.filter((c) => {
                const title =
                    c.cycleId === null || c.cycleId === undefined
                        ? 'None'
                        : (allCycleTitles[c.cycleId!] ?? '');
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
                    c.positionId !== null &&
                    positions.includes(String(c.positionId)),
            );
        }

        return result;
    }, [
        allReviewsData,
        allSurveyQuestions,
        search,
        stages,
        dateRange,
        cycles,
        allCycleTitles,
        teams,
        positions,
    ]);

    // Client-side sorting for all fields
    const sortedSurveys = useMemo(() => {
        return [...filteredSurveys].sort((a, b) => {
            switch (sortField) {
                case 'reviewId':
                    return sortDirection === SortDirection.ASC
                        ? a.reviewId - b.reviewId
                        : b.reviewId - a.reviewId;
                case 'ratee':
                    return sortDirection === SortDirection.ASC
                        ? (a.rateeFullName ?? '').localeCompare(
                              b.rateeFullName ?? '',
                          )
                        : (b.rateeFullName ?? '').localeCompare(
                              a.rateeFullName ?? '',
                          );
                case 'stage': {
                    const indexA = REVIEW_STAGE_ENUM_VALUES.indexOf(a.stage);
                    const indexB = REVIEW_STAGE_ENUM_VALUES.indexOf(b.stage);
                    return sortDirection === SortDirection.ASC
                        ? indexA - indexB
                        : indexB - indexA;
                }
                case 'cycle': {
                    const titleA = a.cycleId
                        ? (allCycleTitles[a.cycleId] ?? '')
                        : '';
                    const titleB = b.cycleId
                        ? (allCycleTitles[b.cycleId] ?? '')
                        : '';
                    return sortDirection === SortDirection.ASC
                        ? titleA.localeCompare(titleB)
                        : titleB.localeCompare(titleA);
                }
                case 'competenceCount': {
                    const countA = a.competenceCount ?? 0;
                    const countB = b.competenceCount ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                case 'questionCount': {
                    const countA = a.questionCount ?? 0;
                    const countB = b.questionCount ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                case 'numericalQuestionCount': {
                    const countA = a.numericalQuestionCount ?? 0;
                    const countB = b.numericalQuestionCount ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                case 'textQuestionCount': {
                    const countA = a.textQuestionCount ?? 0;
                    const countB = b.textQuestionCount ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                case 'date':
                    return sortDirection === SortDirection.ASC
                        ? a.createdAt?.getTime() - b.createdAt?.getTime()
                        : b.createdAt?.getTime() - a.createdAt?.getTime();
                default:
                    return 0;
            }
        });
    }, [filteredSurveys, sortField, sortDirection, allCycleTitles]);

    const totalPages = Math.ceil(sortedSurveys.length / ITEMS_PER_PAGE);
    const paginatedSurveys = sortedSurveys.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    // Summary stats
    const activeReviews = allReviewsData.filter(
        (c) =>
            c.stage === ReviewStage.SELF_ASSESSMENT ||
            c.stage === ReviewStage.WAITING_TO_START ||
            c.stage === ReviewStage.IN_PROGRESS ||
            c.stage === ReviewStage.PREPARING_REPORT ||
            c.stage === ReviewStage.PROCESSING_BY_HR,
    ).length;
    const totalReviews = allReviewsData.length;

    return (
        <div className="mx-auto max-w-8xl gap-8 flex flex-col">
            <Card className="mx-auto gap-6 sm:gap-8 flex flex-col w-full h-full border-border p-4 sm:p-6 md:p-8 overflow-hidden">
                {/* Table Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground break-words">
                            360° Feedback Surveys Table
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage and monitor surveys across your organization.{' '}
                            <span className="font-medium text-foreground">
                                {activeReviews}
                            </span>{' '}
                            active of{' '}
                            <span className="font-medium text-foreground">
                                {totalReviews}
                            </span>{' '}
                            total surveys.
                        </p>
                    </div>
                </div>

                {/* Table Content */}
                <CardContent className="flex flex-col gap-6 m-0 p-0">
                    {/* Filters */}
                    <SurveysFilters
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
                    {(isReviewsLoading ||
                        isAllSurveyQuestionsLoading ||
                        isAllCycleTitlesLoading) && (
                        <div className="flex flex-col text-center items-center justify-center py-16 h-8 w-8 animate-spin text-muted-foreground">
                            <Spinner />
                        </div>
                    )}

                    {/* Error State */}
                    {(isReviewsError ||
                        isAllSurveyQuestionsError ||
                        isAllCycleTitlesError) && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <h3 className="text-lg font-semibold text-destructive">
                                Failed to load surveys
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Please try refreshing the page.
                            </p>
                        </div>
                    )}

                    {/* Table */}
                    {!isReviewsLoading &&
                        !isAllSurveyQuestionsLoading &&
                        !isAllCycleTitlesLoading && (
                            <>
                                <SurveysTable
                                    surveyQuestions={allSurveyQuestions}
                                    surveys={paginatedSurveys}
                                    sortField={sortField}
                                    sortDirection={sortDirection}
                                    onSort={handleSort}
                                    resetTrigger={resetTrigger}
                                />

                                {/* Pagination */}
                                <TablePagination
                                    entityName="surveys"
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalItems={filteredSurveys.length}
                                    limit={ITEMS_PER_PAGE}
                                    onPageChange={setCurrentPage}
                                />
                            </>
                        )}
                </CardContent>
            </Card>
        </div>
    );
}
