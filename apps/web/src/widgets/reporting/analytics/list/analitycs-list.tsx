'use client';

import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import {
    ENTITY_TYPE_ENUM_VALUES,
    EntityType,
    SortDirection,
} from '@entities/reporting/analytics/model/types';
import {
    useReportAnalyticsQuery,
} from '@entities/reporting/analytics/api/analytics.queries';
import type { ReportAnalytics } from '@entities/reporting/analytics/model/mappers';
import { AnalyticsFilters } from '@entities/reporting/analytics/ui/analytics-filters';
import { AnalyticsTable } from '@entities/reporting/analytics/ui/analytics-table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import { Spinner } from '@shared/components/ui/spinner';
import { compareNumberArrays } from '@shared/lib/utils/compare-arrays';
import { TablePagination } from '@shared/ui/table-pagination';

const ITEMS_PER_PAGE = 6;

export function AnalyticsList() {
    const [search, setSearch] = useState('');
    const [entityTypes, setEntityTypes] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        undefined,
    );
    const [questions, setQuestions] = useState<string[]>([]);
    const [competences, setCompetences] = useState<string[]>([]);
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        SortDirection.DESC,
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [resetTrigger, setResetTrigger] = useState(0);

    // Feature dialogs state
    const [deleteReport, setDeleteReport] = useState<Report | null>(null);

    // Build query params (exclude all sort params - sorting is client-side only)
    const queryParams = useMemo(() => {
        const params: Record<string, unknown> = {};

        if (search.trim()) params.search = search.trim();
        if (entityTypes.length === 1) params.entityType = entityTypes[0];
        if (questions.length === 1 && questions[0] !== 'None')
            params.questionTitle = questions[0];
        if (competences.length === 1 && competences[0] !== 'None')
            params.competenceTitle = competences[0];

        return params;
    }, [search, entityTypes, questions, competences]);

    const {
        data: analytics = [],
        isLoading,
        isError,
    } = useReportAnalyticsQuery(queryParams);

    const { data: allAnalyticsData = [] } = useReportAnalyticsQuery({});

    // Filter unique teams and positions
    const entityTypesOptions = useMemo(() => {
        const uniqueEntityTypes = new Set<EntityType>();

        allAnalyticsData.forEach((a) => {
            const type = a.entityType;
            if (type && type.trim() !== '') {
                uniqueEntityTypes.add(type);
            }
        });

        return Array.from(uniqueEntityTypes)
            .sort((a, b) => a.localeCompare(b));
    }, [allAnalyticsData]);

    const questionsOptions = useMemo(() => {
        const uniqueQuestions = new Set<string>();

        allAnalyticsData.forEach((a) => {
            const title = a.questionTitle;
            if (title && title.trim() !== '') {
                uniqueQuestions.add(title);
            }
        });

        return Array.from(uniqueQuestions)
            .sort((a, b) => a.localeCompare(b))
            .map((title) => ({ id: title, title }));
    }, [allAnalyticsData]);

    const competencesOptions = useMemo(() => {
        const uniqueCompetences = new Set<string>();

        allAnalyticsData.forEach((a) => {
            const title = a.competenceTitle;
            if (title && title.trim() !== '') {
                uniqueCompetences.add(title);
            }
        });

        return Array.from(uniqueCompetences)
            .sort((a, b) => a.localeCompare(b))
            .map((title) => ({ id: title, title }));
    }, [allAnalyticsData]);

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
        setEntityTypes([]);
        setQuestions([]);
        setCompetences([]);
        setDateRange(undefined);
        setSortField('createdAt');
        setSortDirection(SortDirection.DESC);
        setCurrentPage(1);
        setResetTrigger((prev) => prev + 1);
    };

    // Client-side filtering for date range and entity title
    const filteredAnalytics = useMemo(() => {
        let result = analytics;

        if (search.trim()) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(
                (a) =>
                    a.questionTitle &&
                    a.questionTitle.toLowerCase().includes(lowerSearch) ||
                    a.competenceTitle &&
                    a.competenceTitle.toLowerCase().includes(lowerSearch)
            );
        }

        if (dateRange?.from) {
            const from = dateRange.from.getTime();
            result = result.filter((a) => a.createdAt.getTime() >= from);
        }
        if (dateRange?.to) {
            const to = dateRange.to.getTime();
            result = result.filter((a) => a.createdAt.getTime() <= to);
        }

        if (entityTypes.length > 0) {
            result = result.filter(
                (a) =>
                    entityTypes.includes(a.entityType),
            );
        }

        if (questions.length > 0) {
            result = result.filter((a) => {
                const title =
                    a.questionTitle === null || a.questionTitle === undefined
                        ? 'None'
                        : (a.questionTitle ?? '');
                return questions.includes(title);
            });
        }

        if (competences.length > 0) {
            result = result.filter((a) => {
                const title =
                    a.competenceTitle === null || a.competenceTitle === undefined
                        ? 'None'
                        : (a.competenceTitle ?? '');
                return competences.includes(title);
            });
        }

        return result;
    }, [
        analytics,
        search,
        dateRange,
        entityTypes,
        questions,
        competences,
    ]);

    // Client-side sorting for all fields
    const sortedAnalytics = useMemo(() => {
        return [...filteredAnalytics].sort((a, b) => {
            switch (sortField) {
                case 'title': {
                    const nameA = a.entityType === EntityType.QUESTION 
                        ? (a.questionTitle ?? '') 
                        : a.entityType === EntityType.COMPETENCE 
                            ? (a.competenceTitle ?? '') 
                            : '';
                    const nameB = b.entityType === EntityType.QUESTION 
                        ? (b.questionTitle ?? '') 
                        : b.entityType === EntityType.COMPETENCE 
                            ? (b.competenceTitle ?? '') 
                            : '';
                    return sortDirection === SortDirection.ASC
                        ? nameA.localeCompare(nameB)
                        : nameB.localeCompare(nameA);
                }
                case 'questionTitle': {
                    const titleA = a.questionTitle ?? '';
                    const titleB = b.questionTitle ?? '';
                    return sortDirection === SortDirection.ASC
                        ? titleA.localeCompare(titleB)
                        : titleB.localeCompare(titleA);
                }
                case 'competenceTitle': {
                    const titleA = a.competenceTitle ?? '';
                    const titleB = b.competenceTitle ?? '';
                    return sortDirection === SortDirection.ASC
                        ? titleA.localeCompare(titleB)
                        : titleB.localeCompare(titleA);
                }
                case 'createdAt':
                    return sortDirection === SortDirection.ASC
                        ? a.createdAt?.getTime() - b.createdAt?.getTime()
                        : b.createdAt?.getTime() - a.createdAt?.getTime();
                case 'entityType': {
                    const typeA = ENTITY_TYPE_ENUM_VALUES.indexOf(a.entityType);
                    const typeB = ENTITY_TYPE_ENUM_VALUES.indexOf(b.entityType);
                    return sortDirection === SortDirection.ASC
                        ? typeA - typeB
                        : typeB - typeA;
                }
                case 'averageBySelfAssessment': {
                    const valA =
                        a.averageBySelfAssessment ??
                        -1;
                    const valB =
                        b.averageBySelfAssessment ??
                        -1;
                    return sortDirection === SortDirection.ASC
                        ? valA - valB
                        : valB - valA;
                }
                case 'averageByTeam': {
                    const valA =
                        a.averageByTeam ?? -1;
                    const valB =
                        b.averageByTeam ?? -1;
                    return sortDirection === SortDirection.ASC
                        ? valA - valB
                        : valB - valA;
                }
                case 'averageByOther': {
                    const valA =
                        a.averageByOther ?? -1;
                    const valB =
                        b.averageByOther ?? -1;
                    return sortDirection === SortDirection.ASC
                        ? valA - valB
                        : valB - valA;
                }
                case 'percentageBySelfAssessment': {
                    const valA =
                        a.percentageBySelfAssessment ??
                        -1;
                    const valB =
                        b.percentageBySelfAssessment ??
                        -1;
                    return sortDirection === SortDirection.ASC
                        ? valA - valB
                        : valB - valA;
                }
                case 'percentageByTeam': {
                    const valA =
                        a.percentageByTeam ?? -1;
                    const valB =
                        b.percentageByTeam ?? -1;
                    return sortDirection === SortDirection.ASC
                        ? valA - valB
                        : valB - valA;
                }
                case 'percentageByOther': {
                    const valA =
                        a.percentageByOther ?? -1;
                    const valB =
                        b.percentageByOther ?? -1;
                    return sortDirection === SortDirection.ASC
                        ? valA - valB
                        : valB - valA;
                }
                case 'deltaPercentageByTeam': {
                    const valA =
                        a.deltaPercentageByTeam ?? -1;
                    const valB =
                        b.deltaPercentageByTeam ?? -1;
                    return sortDirection === SortDirection.ASC
                        ? valA - valB
                        : valB - valA;
                }
                case 'deltaPercentageByOther': {
                    const valA =
                        a.deltaPercentageByOther ?? -1;
                    const valB =
                        b.deltaPercentageByOther ?? -1;
                    return sortDirection === SortDirection.ASC
                        ? valA - valB
                        : valB - valA;
                }
                default:
                    return 0;
            }
        });
    }, [
        filteredAnalytics,
        sortField,
        sortDirection,
    ]);

    const totalPages = Math.ceil(sortedAnalytics.length / ITEMS_PER_PAGE);
    const paginatedAnalytics = sortedAnalytics.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    // Summary stats
    const totalAnalytics = analytics.length;

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-8xl">
                {/* Page Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">
                            360° Feedback Report Analytics
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Monitor report analytics across your organization.{' '}
                            <span className="font-medium text-foreground">
                                {totalAnalytics}
                            </span>{' '}
                            total report analytics.
                        </p>
                    </div>
                </div>

                {/* Main Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">All Report Analytics</CardTitle>
                        <CardDescription>
                            Search, filter, and monitor report analytics.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        {/* Filters */}
                        <AnalyticsFilters
                            search={search}
                            onSearchChange={(val) => {
                                setSearch(val);
                                setCurrentPage(1);
                            }}
                            entityTypes={entityTypes}
                            onEntityTypesChange={(val) => {
                                setEntityTypes(val);
                                setCurrentPage(1);
                            }}
                            dateRange={dateRange}
                            onDateRangeChange={(range) => {
                                setDateRange(range);
                                setCurrentPage(1);
                            }}
                            questions={questions}
                            onQuestionsChange={(val) => {
                                setQuestions(val);
                                setCurrentPage(1);
                            }}
                            competences={competences}
                            onCompetencesChange={(val) => {
                                setCompetences(val);
                                setCurrentPage(1);
                            }}
                            entityTypeOptions={entityTypesOptions}
                            questionOptions={questionsOptions}
                            competenceOptions={competencesOptions}
                            onReset={handleReset}
                        />

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center text-center py-16 h-8 w-8 text-muted-foreground">
                                <Spinner />
                            </div>
                        )}

                        {/* Error State */}
                        {isError && (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <h3 className="text-lg font-semibold text-destructive">
                                    Failed to load report analytics
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Please try refreshing the page.
                                </p>
                            </div>
                        )}

                        {/* Table */}
                        {!isLoading && !isError && (
                            <>
                                <AnalyticsTable
                                    analytics={paginatedAnalytics}
                                    sortField={sortField}
                                    sortDirection={sortDirection}
                                    onSort={handleSort}
                                    resetTrigger={resetTrigger}
                                // onDelete={setDeleteReport}
                                />

                                {/* Pagination */}
                                <TablePagination
                                    entityName="report analytics"
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalItems={filteredAnalytics.length}
                                    limit={ITEMS_PER_PAGE}
                                    onPageChange={setCurrentPage}
                                />
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Feature Dialogs */}
            {/* <DeleteCycleDialog
                cycle={deleteCycle}
                onClose={() => setDeleteCycle(null)}
            /> */}
        </main>
    );
}
