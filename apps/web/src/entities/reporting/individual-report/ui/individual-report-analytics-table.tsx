'use client';

import { Percent, Users } from 'lucide-react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@shared/components/ui/table';
import { formatNumber } from '@shared/lib/utils/format-number';
import { TableColumnHeader } from '@shared/ui/table-column-header';
import { ReportAnalytics } from '../model/mappers';
import { EntityType, ReportEntitySummaryTotalsDto } from '../model/types';

interface IndividualReportAnalyticsTableProps {
    reportAnalytics: ReportAnalytics[];
    summaryTotals: ReportEntitySummaryTotalsDto;
}

export function IndividualReportAnalyticsTable({
    reportAnalytics,
    summaryTotals,
}: IndividualReportAnalyticsTableProps) {
    const sortedAnalytics = [...reportAnalytics]
        .sort((a, b) => {
            const nameA = a.questionTitle ?? a.competenceTitle ?? '';
            const nameB = b.questionTitle ?? b.competenceTitle ?? '';
            return nameA.localeCompare(nameB);
        })
        .map((a, index) => ({ ...a, num: index + 1 }));

    sortedAnalytics.push({
        num: -1,
        id: -1,
        reportId: -1,
        entityType: sortedAnalytics[0].entityType,
        competenceId: -1,
        questionId: -1,
        questionTitle: 'Average by questions',
        competenceTitle: 'Average by competencies',
        averageBySelfAssessment: summaryTotals.averageBySelfAssessment,
        averageByTeam: summaryTotals.averageByTeam,
        averageByOther: summaryTotals.averageByOther,
        percentageBySelfAssessment: summaryTotals.percentageBySelfAssessment,
        percentageByTeam: summaryTotals.percentageByTeam,
        percentageByOther: summaryTotals.percentageByOther,
        deltaPercentageByTeam: summaryTotals.deltaPercentageByTeam,
        deltaPercentageByOther: summaryTotals.deltaPercentageByOther,
        createdAt: sortedAnalytics[0].createdAt,
    });

    const COLUMNS: Record<
        | 'num'
        | 'title'
        | 'averageBySelfAssessment'
        | 'averageByTeam'
        | 'averageByOther'
        | 'percentageBySelfAssessment'
        | 'percentageByTeam'
        | 'percentageByOther'
        | 'deltaPercentageByTeam'
        | 'deltaPercentageByOther',
        {
            header: (
                reportAnalytics?: ReportAnalytics & { num: number },
            ) => React.ReactNode;
            headerClassName: string;
            cell: (
                reportAnalytics: ReportAnalytics & { num: number },
            ) => React.ReactNode;
            cellClassName: string;
        }
    > = {
        num: {
            header: () => (
                <TableColumnHeader
                    label={`#`}
                    className="justify-center items-center text-center !mb-1.5"
                />
            ),
            headerClassName: 'min-w-[35px] w-[35px] align-bottom rounded-full',
            cell: (reportAnalytics) => (
                <div className="flex flex-col gap-0.5 w-full justify-center items-center">
                    <span className="font-medium text-muted-foreground">
                        {reportAnalytics.num
                            ? reportAnalytics.num === -1
                                ? ''
                                : reportAnalytics.num
                            : '—'}
                    </span>
                </div>
            ),
            cellClassName: 'min-w-[200px] whitespace-normal',
        },
        title: {
            header: (reportAnalytics) => (
                <TableColumnHeader
                    label={`${reportAnalytics?.entityType === EntityType.COMPETENCE ? 'Competence' : 'Question'}`}
                    wrapLabelText={true}
                />
            ),
            headerClassName:
                'min-w-[250px] w-[350px] align-bottom  rounded-full',
            cell: (reportAnalytics) => (
                <div className="flex flex-col gap-0.5 w-full">
                    <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                        {reportAnalytics.entityType === EntityType.COMPETENCE
                            ? reportAnalytics.competenceTitle
                            : reportAnalytics.entityType === EntityType.QUESTION
                              ? reportAnalytics.questionTitle
                              : 'None'}
                    </span>
                </div>
            ),
            cellClassName: 'min-w-[200px] whitespace-normal',
        },
        averageBySelfAssessment: {
            header: (reportAnalytics) => (
                <TableColumnHeader
                    label={[
                        `${reportAnalytics?.entityType === EntityType.COMPETENCE ? 'Average' : 'Score'} by`,
                        'self',
                    ]}
                    wrapLabelText={true}
                    className="!text-amber-800"
                />
            ),
            headerClassName:
                'min-w-[50px] w-[100px] whitespace-nowrap text-center align-bottom',
            cell: (reportAnalytics) => (
                <div className="flex items-center justify-start pl-3 gap-1.5">
                    <span className="font-medium text-amber-800">
                        {formatNumber(reportAnalytics.averageBySelfAssessment)}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        averageByTeam: {
            header: (reportAnalytics) => (
                <TableColumnHeader
                    label={[
                        `${reportAnalytics?.entityType === EntityType.COMPETENCE ? 'Average' : 'Score'} by`,
                        'team',
                    ]}
                    wrapLabelText={true}
                    className="!text-blue-800"
                />
            ),
            headerClassName:
                'min-w-[50px] w-[100px] whitespace-nowrap text-center align-bottom',
            cell: (reportAnalytics) => (
                <div className="flex items-center justify-start pl-3 gap-1.5">
                    <span className="font-medium text-blue-800">
                        {formatNumber(reportAnalytics.averageByTeam)}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        averageByOther: {
            header: (reportAnalytics) => (
                <TableColumnHeader
                    label={[
                        `${reportAnalytics?.entityType === EntityType.COMPETENCE ? 'Average' : 'Score'} by`,
                        'others',
                    ]}
                    wrapLabelText={true}
                    className="!text-violet-800"
                />
            ),
            headerClassName:
                'min-w-[50px] w-[100px] whitespace-nowrap text-center align-bottom',
            cell: (reportAnalytics) => (
                <div className="flex items-center justify-start pl-3 gap-1.5">
                    <span className="font-medium text-violet-800">
                        {formatNumber(reportAnalytics.averageByOther)}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        percentageBySelfAssessment: {
            header: (reportAnalytics) => (
                <TableColumnHeader
                    label={['Rating % by', 'self']}
                    wrapLabelText={true}
                    className="!text-amber-800"
                />
            ),
            headerClassName:
                'min-w-[50px] w-[100px] whitespace-nowrap text-center align-bottom',
            cell: (reportAnalytics) => (
                <div className="flex items-center justify-start pl-3 gap-1.5">
                    <span className="font-medium text-amber-800">
                        {formatNumber(
                            reportAnalytics.percentageBySelfAssessment,
                        )}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        percentageByTeam: {
            header: (reportAnalytics) => (
                <TableColumnHeader
                    label={['Rating % by', 'team']}
                    wrapLabelText={true}
                    className="!text-blue-800"
                />
            ),
            headerClassName:
                'min-w-[50px] w-[100px] whitespace-nowrap text-center align-bottom',
            cell: (reportAnalytics) => (
                <div className="flex items-center justify-start pl-3 gap-1.5">
                    <span className="font-medium text-blue-800">
                        {formatNumber(reportAnalytics.percentageByTeam)}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        percentageByOther: {
            header: (reportAnalytics) => (
                <TableColumnHeader
                    label={['Rating % by', 'others']}
                    wrapLabelText={true}
                    className="!text-violet-800"
                />
            ),
            headerClassName:
                'min-w-[50px] w-[100px] whitespace-nowrap text-center align-bottom',
            cell: (reportAnalytics) => (
                <div className="flex items-center justify-start pl-3 gap-1.5">
                    <span className="font-medium text-violet-800">
                        {formatNumber(reportAnalytics.percentageByOther)}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        deltaPercentageByTeam: {
            header: (reportAnalytics) => (
                <TableColumnHeader
                    label={['Delta % by', 'team']}
                    wrapLabelText={true}
                    className="!text-blue-800"
                />
            ),
            headerClassName:
                'min-w-[100px] w-[100px] whitespace-nowrap text-center align-bottom',
            cell: (reportAnalytics) => {
                const numberValue =
                    reportAnalytics.deltaPercentageByTeam ?? null;
                const isPositive = numberValue !== null && numberValue > 0;
                const isNegative = numberValue !== null && numberValue < 0;
                const color = isPositive
                    ? 'text-green-800'
                    : isNegative
                      ? 'text-red-800'
                      : 'ml-5 text-muted-foreground';
                const stringValue = reportAnalytics.deltaPercentageByTeam
                    ? (isPositive ? '↑ +' : isNegative ? '↓ ' : '') +
                      formatNumber(reportAnalytics.deltaPercentageByTeam)
                    : `0`;
                return (
                    <div className="flex items-center justify-start pl-3 gap-1.5">
                        <span className={`font-medium ${color}`}>
                            {stringValue}
                        </span>
                    </div>
                );
            },
            cellClassName: 'whitespace-nowrap text-center',
        },
        deltaPercentageByOther: {
            header: (reportAnalytics) => (
                <TableColumnHeader
                    label={['Delta % by', 'others']}
                    wrapLabelText={true}
                    className="!text-violet-800"
                />
            ),
            headerClassName:
                'min-w-[100px] w-[100px] whitespace-nowrap text-center align-bottom',
            cell: (reportAnalytics) => {
                const numberValue =
                    reportAnalytics.deltaPercentageByOther ?? null;
                const isPositive = numberValue !== null && numberValue > 0;
                const isNegative = numberValue !== null && numberValue < 0;
                const color = isPositive
                    ? 'text-green-800'
                    : isNegative
                      ? 'text-red-800'
                      : 'ml-5 text-muted-foreground';
                const stringValue = reportAnalytics.deltaPercentageByOther
                    ? (isPositive ? '↑ +' : isNegative ? '↓ ' : '') +
                      formatNumber(reportAnalytics.deltaPercentageByOther)
                    : `0`;
                return (
                    <div className="flex items-center justify-start pl-3 gap-1.5">
                        <span className={`font-medium ${color}`}>
                            {stringValue}
                        </span>
                    </div>
                );
            },
            cellClassName: 'whitespace-nowrap text-center',
        },
    };

    const columns = Object.keys(COLUMNS);

    if (sortedAnalytics.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                    No report analytics found
                </h3>
            </div>
        );
    }

    return (
        <>
            {/* Mobile card layout (hidden on md+) */}
            <div className="flex flex-col gap-3 lg:hidden">
                {sortedAnalytics.map((reportAnalytics) => (
                    <div
                        key={reportAnalytics.id}
                        className="rounded-lg border bg-card p-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                                <p className="flex items-center gap-x-2 gap-y-1 font-medium text-foreground flex-wrap">
                                    <span className="break-words">
                                        {reportAnalytics.entityType ===
                                        EntityType.COMPETENCE
                                            ? reportAnalytics.competenceTitle
                                            : reportAnalytics.entityType ===
                                                EntityType.QUESTION
                                              ? reportAnalytics.questionTitle
                                              : 'None'}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            {(reportAnalytics.averageBySelfAssessment ||
                                reportAnalytics.averageByOther ||
                                reportAnalytics.averageByTeam) && (
                                <span className="flex flex-wrap items-center gap-x-2 gap-y-2">
                                    <span className="flex items-center justify-start gap-1 text-muted-foreground w-[80px]">
                                        {reportAnalytics?.entityType ===
                                        EntityType.COMPETENCE
                                            ? 'Average'
                                            : 'Score'}{' '}
                                        by
                                    </span>
                                    <span className="flex items-center justify-start gap-1 text-muted-foreground w-[60px]">
                                        {'self'}
                                        <span className="font-medium text-amber-800">
                                            {formatNumber(
                                                reportAnalytics.averageBySelfAssessment,
                                            ) ?? '—'}
                                        </span>
                                    </span>
                                    <span className="flex items-center justify-start gap-1 text-muted-foreground w-[80px]">
                                        {'team'}
                                        <span className="font-medium text-blue-800">
                                            {formatNumber(
                                                reportAnalytics.averageByTeam,
                                            ) ?? '—'}
                                        </span>
                                    </span>
                                    <span className="flex items-center gap-1 text-muted-foreground w-[75px]">
                                        {'others'}
                                        <span className="font-medium text-violet-800">
                                            {formatNumber(
                                                reportAnalytics.averageByOther,
                                            ) ?? '—'}
                                        </span>
                                    </span>
                                </span>
                            )}

                            {(reportAnalytics.percentageBySelfAssessment ||
                                reportAnalytics.percentageByTeam ||
                                reportAnalytics.percentageByOther) && (
                                <span className="flex flex-wrap items-center gap-x-2 gap-y-2">
                                    <span className="flex items-center justify-start gap-1 text-muted-foreground w-[80px]">
                                        {'Rating'}
                                        <Percent className="h-3 w-3 text-muted-foreground shrink-0" />
                                        {'by'}
                                    </span>
                                    <span className="flex items-center justify-start gap-1 text-muted-foreground w-[60px]">
                                        {'self'}
                                        <span className="font-medium text-amber-800">
                                            {formatNumber(
                                                reportAnalytics.percentageBySelfAssessment,
                                            ) ?? '—'}
                                        </span>
                                    </span>
                                    <span className="flex items-center justify-start gap-1 text-muted-foreground w-[80px]">
                                        {'team'}
                                        <span className="font-medium text-blue-800">
                                            {formatNumber(
                                                reportAnalytics.percentageByTeam,
                                            ) ?? '—'}
                                        </span>
                                    </span>
                                    <span className="flex items-center justify-start gap-1 text-muted-foreground w-[75px]">
                                        {'others'}
                                        <span className="font-medium text-violet-800">
                                            {formatNumber(
                                                reportAnalytics.percentageByOther,
                                            ) ?? '—'}
                                        </span>
                                    </span>
                                </span>
                            )}
                            {(reportAnalytics.deltaPercentageByTeam ||
                                reportAnalytics.deltaPercentageByOther) && (
                                <span className="flex flex-wrap items-center gap-x-2 gap-y-2">
                                    <span className="flex items-center justify-start gap-1 text-muted-foreground w-[80px]">
                                        {'Delta'}
                                        <Percent className="h-3 w-3 text-muted-foreground shrink-0" />
                                        {'by'}
                                    </span>
                                    <span className="flex items-center justify-start gap-1 text-muted-foreground w-[110px]">
                                        <span className="font-medium text-blue-800">
                                            {'team'}
                                        </span>
                                        <span
                                            className={`${reportAnalytics.deltaPercentageByTeam && reportAnalytics.deltaPercentageByTeam > 0 ? '!text-green-600' : '!text-red-600'} text-foreground`}
                                        >
                                            {`${reportAnalytics.deltaPercentageByTeam && reportAnalytics.deltaPercentageByTeam > 0 ? '↑ +' : '↓ '}${formatNumber(reportAnalytics.deltaPercentageByTeam) ?? '—'}`}
                                        </span>
                                    </span>
                                    <span className="flex items-center justify-start gap-1 text-muted-foreground w-[110px]">
                                        <span className="font-medium text-violet-800">
                                            {'others'}
                                        </span>
                                        <span
                                            className={`${reportAnalytics.deltaPercentageByOther && reportAnalytics.deltaPercentageByOther > 0 ? '!text-green-600' : '!text-red-600'} text-foreground`}
                                        >
                                            {`${reportAnalytics.deltaPercentageByOther && reportAnalytics.deltaPercentageByOther > 0 ? '↑ +' : '↓ '}${formatNumber(reportAnalytics.deltaPercentageByOther) ?? '—'}`}
                                        </span>
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop table layout (visible on md+) */}
            <div className="hidden overflow-x-auto lg:block">
                <Table className="w-full table-fixed">
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            {columns.map((columnKey) => {
                                const col = COLUMNS[columnKey];
                                return (
                                    <TableHead
                                        key={columnKey}
                                        className={col.headerClassName}
                                    >
                                        {col.header(
                                            sortedAnalytics[0] ??
                                                EntityType.QUESTION,
                                        )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedAnalytics.map((analytics) => (
                            <TableRow key={analytics.id}>
                                {columns.map((columnKey) => {
                                    const col = COLUMNS[columnKey];
                                    return (
                                        <TableCell
                                            key={columnKey}
                                            className={col.cellClassName}
                                        >
                                            {col.cell(analytics)}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
