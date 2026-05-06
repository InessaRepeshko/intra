'use client';

import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import {
    useQuestionTemplateAllPositionTitlesQuery,
    useQuestionTemplateCompetenceTitlesQuery,
    useQuestionTemplatePositionCountsQuery,
    useQuestionTemplatesQuery,
} from '@entities/library/question-template/api/question-template.queries';
import type { QuestionTemplate } from '@entities/library/question-template/model/mappers';
import {
    ANSWER_TYPE_ENUM_VALUES,
    AnswerType,
    FOR_SELFASSESSMENT_TYPES_ENUM_VALUES,
    ForSelfassessmentType,
    QUESTION_TEMPLATE_STATUSES_ENUM_VALUES,
    QuestionTemplateStatus,
    SortDirection,
} from '@entities/library/question-template/model/types';
import { QuestionTemplatesFilters } from '@entities/library/question-template/ui/question-templates-filters';
import { QuestionTemplatesTable } from '@entities/library/question-template/ui/question-templates-table';
import { ArchiveQuestionTemplateDialog } from '@features/library/question-template/archive/ui/ArchiveQuestionTemplateDialog';
import { DeleteQuestionTemplateDialog } from '@features/library/question-template/delete/ui/DeleteQuestionTemplateDialog';
import { QuestionTemplateFormDialog } from '@features/library/question-template/form/ui/QuestionTemplateFormDialog';
import { Button } from '@shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import { Spinner } from '@shared/components/ui/spinner';
import { compareStringArrays } from '@shared/lib/utils/compare-arrays';
import { TablePagination } from '@shared/ui/table-pagination';

const ITEMS_PER_PAGE = 6;

export function QuestionTemplateList() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [statuses, setStatuses] = useState<string[]>([]);
    const [answerTypes, setAnswerTypes] = useState<string[]>([]);
    const [forSelfassessmentTypes, setForSelfassessmentTypes] = useState<
        string[]
    >([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        undefined,
    );
    const [competencies, setCompetencies] = useState<string[]>([]);
    const [positions, setPositions] = useState<string[]>([]);
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        SortDirection.DESC,
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [resetTrigger, setResetTrigger] = useState(0);

    // Feature dialogs state
    const [viewingQuestionTemplate, setViewingQuestionTemplate] =
        useState<QuestionTemplate | null>(null);
    const [editingQuestionTemplate, setEditingQuestionTemplate] =
        useState<QuestionTemplate | null>(null);
    const [archivingQuestionTemplate, setArchivingQuestionTemplate] =
        useState<QuestionTemplate | null>(null);
    const [deletingQuestionTemplate, setDeletingQuestionTemplate] =
        useState<QuestionTemplate | null>(null);

    // Build query params (exclude all sort params and forSelfassessment - they are client-side only)
    const queryParams = useMemo(() => {
        const params: Record<string, unknown> = {};

        if (search.trim()) params.title = search.trim();
        if (statuses.length === 1) params.status = statuses[0];
        if (answerTypes.length === 1) params.answerType = answerTypes[0];
        // Note: isForSelfassessment filtering is done client-side only
        if (competencies.length === 1) params.competenceId = competencies[0];
        if (positions.length === 1) params.positionId = positions[0];

        return params;
    }, [search, statuses, answerTypes, competencies, positions]);

    const {
        data: questionTemplates = [],
        isLoading,
        isError,
    } = useQuestionTemplatesQuery(queryParams);

    const {
        data: allQuestionTemplatesData = [],
        isLoading: isQuestionTemplatesLoading,
    } = useQuestionTemplatesQuery({});
    const allQuestionTemplateIds = allQuestionTemplatesData.map((q) => q.id);
    const allCompetenceIds = allQuestionTemplatesData.map(
        (q) => q.competenceId,
    );
    const questionTemplatesPositionIds = allQuestionTemplatesData.map((q) => {
        return {
            questionTemplateId: q.id,
            positionIds: q.positionIds,
        };
    });

    // Fetch competence, position counts and titles for all question templates
    const { competenceTitles, isLoading: isCompetenceTitlesLoading } =
        useQuestionTemplateCompetenceTitlesQuery(allCompetenceIds);
    const {
        positionTitles: questionTemplatesPositionTitles,
        isLoading: isPositionTitlesLoading,
    } = useQuestionTemplateAllPositionTitlesQuery(questionTemplatesPositionIds);
    const { positionCounts, isLoading: isPositionCountsLoading } =
        useQuestionTemplatePositionCountsQuery(allQuestionTemplateIds);

    // Filter unique competencies and positions
    const competenceOptions = useMemo(() => {
        const uniqueCompetencies = new Set<string>();

        allQuestionTemplatesData.forEach((q) => {
            const title = q.competenceId
                ? competenceTitles[q.competenceId]
                : undefined;
            if (q.competenceId === null || q.competenceId === undefined) {
                uniqueCompetencies.add('None');
            }
            if (title && title.trim() !== '') {
                uniqueCompetencies.add(title);
            }
        });

        let competenceOptions = Array.from(uniqueCompetencies)
            .sort((a, b) => a.localeCompare(b))
            .map((title) => ({ id: title, title }));

        if (competenceOptions.some((c) => c.title === 'None')) {
            const noneOption = competenceOptions.find(
                (c) => c.title === 'None',
            );
            const filteredCompetenceOptions = competenceOptions.filter(
                (c) => c.title !== 'None',
            );
            competenceOptions = noneOption
                ? [noneOption, ...filteredCompetenceOptions]
                : competenceOptions;
        }
        return competenceOptions;
    }, [allQuestionTemplatesData, competenceTitles]);

    const positionOptions = useMemo(() => {
        const uniquePositions = new Set<string>();

        allQuestionTemplatesData.forEach((questionTemplate) => {
            if (
                questionTemplate.positionIds === null ||
                questionTemplate.positionIds === undefined ||
                questionTemplate.positionIds.length === 0
            ) {
                uniquePositions.add('None');
            }
            questionTemplate.positionIds?.forEach((positionId) => {
                const positions =
                    questionTemplatesPositionTitles[questionTemplate.id] || [];
                const position = positions.find((p) => p.id === positionId);
                const title = position?.title;
                if (title === null || title === undefined) {
                    uniquePositions.add('None');
                }
                if (title && title.trim() !== '') {
                    uniquePositions.add(title);
                }
            });
        });

        return Array.from(uniquePositions)
            .sort((a, b) => a.localeCompare(b))
            .map((title) => ({ id: title, title }));
    }, [allQuestionTemplatesData, questionTemplatesPositionTitles]);

    const statusOptions = useMemo(() => {
        const uniqueStatuses = new Set<QuestionTemplateStatus>();

        allQuestionTemplatesData.forEach((questionTemplate) => {
            uniqueStatuses.add(questionTemplate.status);
        });

        return Array.from(uniqueStatuses).sort(
            (a, b) =>
                QUESTION_TEMPLATE_STATUSES_ENUM_VALUES.indexOf(a) -
                QUESTION_TEMPLATE_STATUSES_ENUM_VALUES.indexOf(b),
        );
    }, [allQuestionTemplatesData]);

    const answerTypeOptions = useMemo(() => {
        const uniqueAnswerTypes = new Set<AnswerType>();

        allQuestionTemplatesData.forEach((questionTemplate) => {
            uniqueAnswerTypes.add(questionTemplate.answerType);
        });

        return Array.from(uniqueAnswerTypes).sort(
            (a, b) =>
                ANSWER_TYPE_ENUM_VALUES.indexOf(a) -
                ANSWER_TYPE_ENUM_VALUES.indexOf(b),
        );
    }, [allQuestionTemplatesData]);

    const forSelfassessmentOptions = useMemo(() => {
        const uniqueForSelfassessmentTypes = new Set<ForSelfassessmentType>();

        allQuestionTemplatesData.forEach((questionTemplate) => {
            // isForSelfassessment is now guaranteed to be boolean via mapper
            uniqueForSelfassessmentTypes.add(
                questionTemplate.isForSelfassessment
                    ? ForSelfassessmentType.TRUE
                    : ForSelfassessmentType.FALSE,
            );
        });

        return Array.from(uniqueForSelfassessmentTypes).sort((a, b) => {
            const typeA = FOR_SELFASSESSMENT_TYPES_ENUM_VALUES.indexOf(a);
            const typeB = FOR_SELFASSESSMENT_TYPES_ENUM_VALUES.indexOf(b);
            return typeA - typeB;
        });
    }, [allQuestionTemplatesData]);

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
        setStatuses([]);
        setAnswerTypes([]);
        setForSelfassessmentTypes([]);
        setDateRange(undefined);
        setCompetencies([]);
        setPositions([]);
        setSortField('createdAt');
        setSortDirection(SortDirection.DESC);
        setCurrentPage(1);
        setResetTrigger((prev) => prev + 1);
    };

    // Client-side filtering for date range, title, competence and position titles
    const filteredQuestionTemplates = useMemo(() => {
        let result = questionTemplates;

        if (search.trim()) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(
                (r) => r.title && r.title.toLowerCase().includes(lowerSearch),
            );
        }

        if (dateRange?.from) {
            const from = dateRange.from.getTime();
            result = result.filter((r) => r.createdAt.getTime() >= from);
        }
        if (dateRange?.to) {
            const to = dateRange.to.getTime();
            result = result.filter((r) => r.createdAt.getTime() <= to);
        }

        if (competencies.length > 0) {
            result = result.filter(
                (r) =>
                    r.competenceId !== undefined &&
                    r.competenceId !== null &&
                    competencies.includes(
                        competenceTitles[r.competenceId] ?? '',
                    ),
            );
        }

        if (positions.length > 0) {
            const hasNoneFilter = positions.includes('None');
            const regularPositions = positions.filter((c) => c !== 'None');

            result = result.filter((r) => {
                const questionTemplatePositionTitles =
                    questionTemplatesPositionTitles[r.id] || [];
                const hasNoPositions =
                    !questionTemplatePositionTitles ||
                    questionTemplatePositionTitles.length === 0;

                const matchesNone = hasNoneFilter && hasNoPositions;

                const matchesRegularPositions =
                    regularPositions.length > 0 &&
                    questionTemplatePositionTitles.some((position) =>
                        regularPositions.includes(position.title),
                    );

                if (hasNoneFilter && regularPositions.length === 0) {
                    return matchesNone;
                } else if (!hasNoneFilter && regularPositions.length > 0) {
                    return matchesRegularPositions;
                } else {
                    return matchesNone || matchesRegularPositions;
                }
            });
        }

        if (statuses.length > 0) {
            result = result.filter(
                (r) =>
                    r.status &&
                    r.status !== null &&
                    statuses.includes(r.status),
            );
        }

        if (answerTypes.length > 0) {
            result = result.filter(
                (r) =>
                    r.answerType &&
                    r.answerType !== null &&
                    answerTypes.includes(r.answerType),
            );
        }

        if (forSelfassessmentTypes.length > 0) {
            result = result.filter((r) => {
                // Normalize to boolean (handle both string "true"/"false" and actual booleans)
                const boolValue =
                    typeof r.isForSelfassessment === 'string'
                        ? r.isForSelfassessment === 'true'
                        : Boolean(r.isForSelfassessment);
                const type = boolValue
                    ? ForSelfassessmentType.TRUE
                    : ForSelfassessmentType.FALSE;
                return forSelfassessmentTypes.includes(type);
            });
        }

        return result;
    }, [
        questionTemplates,
        search,
        dateRange,
        statuses,
        answerTypes,
        forSelfassessmentTypes,
        competenceTitles,
        questionTemplatesPositionTitles,
        competencies,
        positions,
    ]);

    // Client-side sorting for all fields
    const sortedQuestionTemplates = useMemo(() => {
        return [...filteredQuestionTemplates].sort((a, b) => {
            switch (sortField) {
                case 'title': {
                    const nameA = a.title ?? '';
                    const nameB = b.title ?? '';
                    return sortDirection === SortDirection.ASC
                        ? nameA.localeCompare(nameB)
                        : nameB.localeCompare(nameA);
                }
                case 'answerType': {
                    const statusA = ANSWER_TYPE_ENUM_VALUES.indexOf(
                        a.answerType,
                    );
                    const statusB = ANSWER_TYPE_ENUM_VALUES.indexOf(
                        b.answerType,
                    );
                    return sortDirection === SortDirection.ASC
                        ? statusA - statusB
                        : statusB - statusA;
                }
                case 'createdAt':
                    return sortDirection === SortDirection.ASC
                        ? a.createdAt?.getTime() - b.createdAt?.getTime()
                        : b.createdAt?.getTime() - a.createdAt?.getTime();
                case 'isForSelfassessment': {
                    // Normalize to boolean and then to enum string
                    const boolA =
                        typeof a.isForSelfassessment === 'string'
                            ? a.isForSelfassessment === 'true'
                            : Boolean(a.isForSelfassessment);
                    const boolB =
                        typeof b.isForSelfassessment === 'string'
                            ? b.isForSelfassessment === 'true'
                            : Boolean(b.isForSelfassessment);
                    const typeA = FOR_SELFASSESSMENT_TYPES_ENUM_VALUES.indexOf(
                        boolA
                            ? ForSelfassessmentType.TRUE
                            : ForSelfassessmentType.FALSE,
                    );
                    const typeB = FOR_SELFASSESSMENT_TYPES_ENUM_VALUES.indexOf(
                        boolB
                            ? ForSelfassessmentType.TRUE
                            : ForSelfassessmentType.FALSE,
                    );
                    return sortDirection === SortDirection.ASC
                        ? typeA - typeB
                        : typeB - typeA;
                }
                case 'status': {
                    const statusA =
                        QUESTION_TEMPLATE_STATUSES_ENUM_VALUES.indexOf(
                            a.status,
                        );
                    const statusB =
                        QUESTION_TEMPLATE_STATUSES_ENUM_VALUES.indexOf(
                            b.status,
                        );
                    return sortDirection === SortDirection.ASC
                        ? statusA - statusB
                        : statusB - statusA;
                }
                case 'competence': {
                    const titleA = a.competenceId
                        ? (competenceTitles[a.competenceId] ?? '')
                        : '';
                    const titleB = b.competenceId
                        ? (competenceTitles[b.competenceId] ?? '')
                        : '';
                    return sortDirection === SortDirection.ASC
                        ? titleA.localeCompare(titleB)
                        : titleB.localeCompare(titleA);
                }
                case 'positions': {
                    const positionsA = questionTemplatesPositionTitles[a.id]
                        ?.map((position) => position.title)
                        .sort();
                    const positionsB = questionTemplatesPositionTitles[b.id]
                        ?.map((position) => position.title)
                        .sort();
                    const comparison = compareStringArrays(
                        positionsA,
                        positionsB,
                    );
                    return sortDirection === SortDirection.ASC
                        ? comparison
                        : -comparison;
                }
                default:
                    return 0;
            }
        });
    }, [
        filteredQuestionTemplates,
        sortField,
        sortDirection,
        competenceTitles,
        questionTemplatesPositionTitles,
        statuses,
        answerTypes,
        forSelfassessmentTypes,
        competencies,
        positions,
    ]);

    const totalPages = Math.ceil(
        sortedQuestionTemplates.length / ITEMS_PER_PAGE,
    );
    const paginatedQuestionTemplates = sortedQuestionTemplates.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    // Summary stats
    const activeQuestionTemplates = questionTemplates.filter(
        (r) => r.status === QuestionTemplateStatus.ACTIVE,
    ).length;
    const totalQuestionTemplates = questionTemplates.length;

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-8xl">
                {/* Page Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">
                            Library of Question Templates
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage question templates across your organization.{' '}
                            <span className="font-medium text-foreground">
                                {activeQuestionTemplates}
                            </span>{' '}
                            active of{' '}
                            <span className="font-medium text-foreground">
                                {totalQuestionTemplates}
                            </span>{' '}
                            total question templates.
                        </p>
                    </div>
                    <Button
                        size="lg"
                        className="shrink-0 rounded-xl"
                        onClick={() => setIsCreateOpen(true)}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create New
                    </Button>
                </div>

                {/* Main Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            All Question Templates
                        </CardTitle>
                        <CardDescription>
                            Search, filter, and manage question templates.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        {/* Filters */}
                        <QuestionTemplatesFilters
                            search={search}
                            onSearchChange={(val) => {
                                setSearch(val);
                                setCurrentPage(1);
                            }}
                            statuses={statuses}
                            onStatusesChange={(val) => {
                                setStatuses(val);
                                setCurrentPage(1);
                            }}
                            answerTypes={answerTypes}
                            onAnswerTypesChange={(val) => {
                                setAnswerTypes(val);
                                setCurrentPage(1);
                            }}
                            forSelfassessmentTypes={forSelfassessmentTypes}
                            onForSelfassessmentChange={(val) => {
                                setForSelfassessmentTypes(val);
                                setCurrentPage(1);
                            }}
                            dateRange={dateRange}
                            onDateRangeChange={(range) => {
                                setDateRange(range);
                                setCurrentPage(1);
                            }}
                            competences={competencies}
                            onCompetencesChange={(val) => {
                                setCompetencies(val);
                                setCurrentPage(1);
                            }}
                            positions={positions}
                            onPositionsChange={(val) => {
                                setPositions(val);
                                setCurrentPage(1);
                            }}
                            statusOptions={statusOptions}
                            answerTypeOptions={answerTypeOptions}
                            forSelfassessmentOptions={forSelfassessmentOptions}
                            competenceOptions={competenceOptions}
                            positionOptions={positionOptions}
                            onReset={handleReset}
                        />

                        {/* Loading State */}
                        {(isLoading ||
                            isQuestionTemplatesLoading ||
                            isCompetenceTitlesLoading ||
                            isPositionTitlesLoading ||
                            isPositionCountsLoading) && (
                            <div className="flex flex-col items-center justify-center text-center py-16 h-8 w-8 text-muted-foreground">
                                <Spinner />
                            </div>
                        )}

                        {/* Error State */}
                        {isError && (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <h3 className="text-lg font-semibold text-destructive">
                                    Failed to load question templates
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Please try refreshing the page.
                                </p>
                            </div>
                        )}

                        {/* Table */}
                        {!isLoading &&
                            !isError &&
                            !isQuestionTemplatesLoading &&
                            !isCompetenceTitlesLoading &&
                            !isPositionTitlesLoading &&
                            !isPositionCountsLoading && (
                                <>
                                    <QuestionTemplatesTable
                                        questionTemplates={
                                            paginatedQuestionTemplates
                                        }
                                        positionCounts={positionCounts}
                                        competenceTitles={competenceTitles}
                                        positionTitles={
                                            questionTemplatesPositionTitles
                                        }
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                        onView={setViewingQuestionTemplate}
                                        onEdit={setEditingQuestionTemplate}
                                        onArchive={setArchivingQuestionTemplate}
                                        onDelete={setDeletingQuestionTemplate}
                                        resetTrigger={resetTrigger}
                                    />

                                    {/* Pagination */}
                                    <TablePagination
                                        entityName="question templates"
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        totalItems={
                                            filteredQuestionTemplates.length
                                        }
                                        limit={ITEMS_PER_PAGE}
                                        onPageChange={setCurrentPage}
                                    />
                                </>
                            )}
                    </CardContent>
                </Card>
            </div>

            {/* Feature Dialogs */}
            <QuestionTemplateFormDialog
                mode="create"
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />
            <QuestionTemplateFormDialog
                mode="view"
                questionTemplate={viewingQuestionTemplate}
                onClose={() => setViewingQuestionTemplate(null)}
            />
            <QuestionTemplateFormDialog
                mode="edit"
                questionTemplate={editingQuestionTemplate}
                onClose={() => setEditingQuestionTemplate(null)}
            />
            <ArchiveQuestionTemplateDialog
                questionTemplate={archivingQuestionTemplate}
                onClose={() => setArchivingQuestionTemplate(null)}
            />
            <DeleteQuestionTemplateDialog
                questionTemplate={deletingQuestionTemplate}
                onClose={() => setDeletingQuestionTemplate(null)}
            />
        </main>
    );
}
