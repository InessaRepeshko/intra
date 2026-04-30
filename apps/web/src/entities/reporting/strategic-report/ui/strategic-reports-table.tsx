'use client';

import { format } from 'date-fns';
import {
    Award,
    Bookmark,
    BookmarkCheck,
    Calendar,
    Eye,
    FileChartLine,
    FileQuestionMark,
    MessageCircle,
    UserRound,
    UserRoundPen,
    Users,
    UsersRound,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { cn } from '@/shared/lib/utils/cn';
import { AvatarGroupList } from '@/shared/ui/avatar-group-list';
import { AvatarGroupWithCount } from '@/shared/ui/avatar-group-with-count';
import { User } from '@entities/identity/user/model/mappers';
import { Button } from '@shared/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@shared/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@shared/components/ui/tooltip';
import { useDraggableColumns } from '@shared/lib/hooks/use-draggable-columns';
import { formatNumber } from '@shared/lib/utils/format-number';
import { SortableHeader } from '@shared/ui/sortable-table-column-header';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { StrategicReport } from '../model/mappers';
import { SortDirection } from '../model/types';

interface StrategicReportsTableProps {
    strategicReports: StrategicReport[];
    ratees: { cycleId: number; ratees: User[] }[];
    teams: Record<number, { id: number; title: string }[]>;
    // reviews: { cycleId: number; reviews: Review[] }[];
    sortField: string;
    sortDirection: SortDirection;
    onSort: (field: string) => void;
    resetTrigger?: number;
}

function StrategicReportActionsMenu({ report }: { report: StrategicReport }) {
    const router = useRouter();

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground text-center cursor-pointer"
                        onClick={() =>
                            router.push(
                                `/reporting/strategic-reports/${report.id}`,
                            )
                        }
                    >
                        <FileChartLine className=" h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6}>
                    <p>View Report</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export function StrategicReportsTable({
    strategicReports,
    ratees,
    teams,
    sortField,
    sortDirection,
    onSort,
    resetTrigger,
}: StrategicReportsTableProps) {
    const {
        columnOrder,
        handleDragStart,
        handleDragEnter,
        handleDragEnd,
        resetOrder,
    } = useDraggableColumns<
        | 'id'
        | 'cycle'
        | 'ratees'
        | 'teams'
        | 'respondentCount'
        | 'answerCount'
        | 'reviewerCount'
        | 'positionCount'
        | 'competenceCount'
        | 'questionCount'
        | 'turnoutAvgPctOfRatees'
        | 'turnoutAvgPctOfTeams'
        | 'turnoutAvgPctOfOthers'
        | 'competencePctSelf'
        | 'competencePctTeam'
        | 'competencePctOther'
        | 'competenceDeltaTeam'
        | 'competenceDeltaOther'
        | 'date'
        | 'actions'
    >('reports-table', [
        'id',
        'cycle',
        'ratees',
        'teams',
        'respondentCount',
        'answerCount',
        'reviewerCount',
        'positionCount',
        'competenceCount',
        'questionCount',
        'turnoutAvgPctOfRatees',
        'turnoutAvgPctOfTeams',
        'turnoutAvgPctOfOthers',
        'competencePctSelf',
        'competencePctTeam',
        'competencePctOther',
        'competenceDeltaTeam',
        'competenceDeltaOther',
        'date',
        'actions',
    ]);

    useEffect(() => {
        if (resetTrigger && resetTrigger > 0) {
            resetOrder();
        }
    }, [resetTrigger, resetOrder]);

    const ExpandableUsers = ({ users }: { users: User[] }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        if (!users?.length)
            return (
                <div className="text-muted-foreground flex items-center justify-center">
                    —
                </div>
            );

        return (
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                }}
                className={cn(
                    'group flex flex-wrap items-center justify-start gap-1 cursor-pointer transition-all duration-200 p-1 rounded-md hover:bg-muted/50',
                    isExpanded ? 'bg-muted/30' : 'max-w-[400px]',
                )}
            >
                {isExpanded ? (
                    <div className="flex flex-row gap-1 items-center justify-start text-start animate-in fade-in slide-in-from-top-1">
                        <div className="flex items-start justify-start text-start">
                            <AvatarGroupList users={users} />
                        </div>
                        <ChevronUp className="h-3 w-3 text-muted-foreground shrink-0" />
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-1 overflow-hidden">
                        <AvatarGroupWithCount users={users} />
                        <ChevronDown className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                )}
            </div>
        );
    };

    const ExpandableTeams = ({
        teams,
    }: {
        teams: { id: number; title: string }[];
    }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        if (!teams?.length)
            return <span className="text-muted-foreground">None</span>;

        const firstPosition = teams[0].title;
        const extraCount = teams.length - 1;

        return (
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                }}
                className={cn(
                    'group flex flex-wrap items-center justify-start gap-1 cursor-pointer transition-all duration-200 p-1 rounded-md hover:bg-muted/50',
                    isExpanded ? 'bg-muted/30' : 'max-w-[400px]',
                )}
            >
                {isExpanded ? (
                    <div className="flex flex-row items-center justify-center gap-1">
                        <UsersRound className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <div className="flex flex-col flex-wrap gap-1 items-start justify-start text-start animate-in fade-in slide-in-from-top-1">
                            {teams.map((t, index) => (
                                <span
                                    key={t.id}
                                    className="text-sm font-medium text-foreground"
                                >
                                    {t.title}
                                    {index < teams.length - 1 ? ',' : ''}
                                </span>
                            ))}
                        </div>
                        <ChevronUp className="h-3 w-3 text-muted-foreground shrink-0 ml-1" />
                    </div>
                ) : (
                    <div className="flex items-center justify-center text-center gap-1 overflow-hidden">
                        <UsersRound className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="text-sm font-medium truncate text-foreground">
                            {firstPosition}
                        </span>
                        {extraCount > 0 && (
                            <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full shrink-0">
                                +{extraCount}
                            </span>
                        )}
                        <ChevronDown className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                )}
            </div>
        );
    };

    const router = useRouter();

    const COLUMNS: Record<
        | 'id'
        | 'cycle'
        | 'ratees'
        | 'teams'
        | 'respondentCount'
        | 'answerCount'
        | 'reviewerCount'
        | 'positionCount'
        | 'competenceCount'
        | 'questionCount'
        | 'turnoutAvgPctOfRatees'
        | 'turnoutAvgPctOfTeams'
        | 'turnoutAvgPctOfOthers'
        | 'competencePctSelf'
        | 'competencePctTeam'
        | 'competencePctOther'
        | 'competenceDeltaTeam'
        | 'competenceDeltaOther'
        | 'date'
        | 'actions',
        {
            header: React.ReactNode;
            headerClassName: string;
            cell: (strategicReport: StrategicReport) => React.ReactNode;
            cellClassName: string;
        }
    > = {
        id: {
            header: (
                <SortableHeader
                    label="#"
                    field="id"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[75px] w-[75px] text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <div className="flex items-center justify-center gap-1.5">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground text-center cursor-pointer hover:underline"
                        onClick={() =>
                            router.push(
                                `/reporting/strategic-reports/${report.id}`,
                            )
                        }
                    >
                        <span className="font-medium text-foreground">
                            {report.id}
                        </span>
                    </Button>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        cycle: {
            header: (
                <SortableHeader
                    label="Cycle"
                    field="cycleTitle"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[250px] w-[300px] whitespace-nowrap align-bottom cursor-grab active:cursor-grabbing rounded-full',
            cell: (report) => (
                <div className="flex flex-col gap-0.5 w-full">
                    <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                        {report.cycleTitle}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-normal',
        },
        ratees: {
            header: (
                <SortableHeader
                    label="Ratees"
                    field="ratees"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[200px] w-[300px] whitespace-nowrap text-start align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => {
                const users =
                    ratees.find((ratee) => ratee.cycleId === report.cycleId)
                        ?.ratees || [];
                return <ExpandableUsers users={users} />;
            },
            cellClassName:
                'whitespace-nowrap text-start justify-start items-start',
        },
        teams: {
            header: (
                <SortableHeader
                    label="Teams"
                    field="teams"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[200px] w-[250px] whitespace-nowrap text-start align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <ExpandableTeams teams={teams[report.cycleId] || []} />
            ),
            cellClassName: 'text-center',
        },
        respondentCount: {
            header: (
                <SortableHeader
                    label="Respondents"
                    field="respondentCount"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[150px] w-[150px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <div className="flex items-center justify-center gap-1.5">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                        {report.respondentCount ?? `—`}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        answerCount: {
            header: (
                <SortableHeader
                    label="Answers"
                    field="answersCount"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[150px] w-[150px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <div className="flex items-center justify-center gap-1.5">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                        {report.answerCount ?? `—`}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        reviewerCount: {
            header: (
                <SortableHeader
                    label="Reviewers"
                    field="reviewerCount"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[150px] w-[150px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <div className="flex items-center justify-center gap-1.5">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                        {report.reviewerCount ?? `—`}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        positionCount: {
            header: (
                <SortableHeader
                    label="Positions"
                    field="positionCount"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[150px] w-[150px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <div className="flex items-center justify-center gap-1.5">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                        {report.positionCount ?? `—`}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        competenceCount: {
            header: (
                <SortableHeader
                    label="Competences"
                    field="competenceCount"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[150px] w-[150px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <div className="flex items-center justify-center gap-1.5">
                    <Bookmark className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                        {report.competenceCount ?? `—`}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        questionCount: {
            header: (
                <SortableHeader
                    label="Questions"
                    field="questionCount"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[150px] w-[150px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <div className="flex items-center justify-center gap-1.5">
                    <FileQuestionMark className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                        {report.questionCount ?? `—`}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        turnoutAvgPctOfRatees: {
            header: (
                <SortableHeader
                    label="Turnout % of ratees"
                    wrapLabelText={true}
                    field="turnoutAvgPctOfRatees"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[140px] w-[140px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <div className="flex items-center justify-start pl-3 gap-1.5">
                    <UserRoundPen className="h-4 w-4 text-amber-700" />
                    <span className="font-medium text-foreground">
                        {formatNumber(report.turnoutAvgPctOfRatees)}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        turnoutAvgPctOfTeams: {
            header: (
                <SortableHeader
                    label="Turnout % of teams"
                    wrapLabelText={true}
                    field="turnoutAvgPctOfTeams"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[140px] w-[140px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <div className="flex items-center justify-start pl-3 gap-1.5">
                    <UserRoundPen className="h-4 w-4 text-blue-700" />
                    <span className="font-medium text-foreground">
                        {formatNumber(report.turnoutAvgPctOfTeams)}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        turnoutAvgPctOfOthers: {
            header: (
                <SortableHeader
                    label="Turnout % of others"
                    wrapLabelText={true}
                    field="turnoutAvgPctOfOthers"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[140px] w-[140px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <div className="flex items-center justify-start pl-3 gap-1.5">
                    <UserRoundPen className="h-4 w-4 text-violet-700" />
                    <span className="font-medium text-foreground">
                        {formatNumber(report.turnoutAvgPctOfOthers)}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        competencePctSelf: {
            header: (
                <SortableHeader
                    label="Rating % by self"
                    wrapLabelText={true}
                    field="competenceGeneralPctSelf"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[130px] w-[130px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <div className="flex items-center justify-start pl-3 gap-1.5">
                    <BookmarkCheck className="h-4 w-4 text-amber-700" />
                    <span className="font-medium text-foreground">
                        {formatNumber(report.competenceGeneralPctSelf)}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        competencePctTeam: {
            header: (
                <SortableHeader
                    label="Rating % by team"
                    wrapLabelText={true}
                    field="competenceGeneralPctTeam"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[130px] w-[130px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <div className="flex items-center justify-start pl-3 gap-1.5">
                    <BookmarkCheck className="h-4 w-4 text-blue-700" />
                    <span className="font-medium text-foreground">
                        {formatNumber(report.competenceGeneralPctTeam)}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        competencePctOther: {
            header: (
                <SortableHeader
                    label="Rating % by others"
                    wrapLabelText={true}
                    field="competenceGeneralPctOthers"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[130px] w-[130px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <div className="flex items-center justify-start pl-3 gap-1.5">
                    <BookmarkCheck className="h-4 w-4 text-violet-700" />
                    <span className="font-medium text-foreground">
                        {formatNumber(report.competenceGeneralPctOther)}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        competenceDeltaTeam: {
            header: (
                <SortableHeader
                    label="Delta % by team"
                    wrapLabelText={true}
                    field="competenceGeneralDeltaTeam"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[130px] w-[130px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => {
                const numberValue = report.competenceGeneralDeltaTeam ?? null;
                const isPositive = numberValue !== null && numberValue > 0;
                const isNegative = numberValue !== null && numberValue < 0;
                const color = isPositive
                    ? 'text-green-800'
                    : isNegative
                      ? 'text-red-800'
                      : 'ml-5 text-muted-foreground';
                const stringValue = report.competenceGeneralDeltaTeam
                    ? (isPositive ? '↑ +' : isNegative ? '↓ ' : '') +
                      formatNumber(report.competenceGeneralDeltaTeam)
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
        competenceDeltaOther: {
            header: (
                <SortableHeader
                    label="Delta % by others"
                    wrapLabelText={true}
                    field="competenceGeneralDeltaOther"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[130px] w-[130px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => {
                const numberValue = report.competenceGeneralDeltaOther ?? null;
                const isPositive = numberValue !== null && numberValue > 0;
                const isNegative = numberValue !== null && numberValue < 0;
                const color = isPositive
                    ? 'text-green-800'
                    : isNegative
                      ? 'text-red-800'
                      : 'ml-5 text-muted-foreground';
                const stringValue = report.competenceGeneralDeltaOther
                    ? (isPositive ? '↑ +' : isNegative ? '↓ ' : '') +
                      formatNumber(report.competenceGeneralDeltaOther)
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
        date: {
            header: (
                <SortableHeader
                    label="Creation Date"
                    field="createdAt"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[150px] w-[150px] whitespace-nowrap align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <div className="flex flex-col items-center justify-start gap-0.5 text-sm">
                    <span className="text-foreground">
                        {format(report.createdAt, 'MMM dd, yyyy')}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap',
        },
        actions: {
            header: <span className="text-muted-foreground">Report</span>,
            headerClassName:
                'min-w-[80px] w-[100px] whitespace-nowrap text-center align-bottom pb-2',
            cell: (report) => <StrategicReportActionsMenu report={report} />,
            cellClassName: 'whitespace-nowrap text-center',
        },
    };

    if (strategicReports.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-4">
                    <FileChartLine className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                    No reports found
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your filters.
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Mobile card layout (hidden on md+) */}
            <div className="flex flex-col gap-3 lg:hidden">
                {strategicReports.map((report) => (
                    <div
                        key={report.id}
                        className="rounded-lg border bg-card p-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                                <p className="flex items-center gap-x-2 gap-y-1 font-medium text-foreground flex-wrap">
                                    <span className="text-muted-foreground">
                                        #{report.id}
                                    </span>
                                    <span className="break-words">
                                        {report.cycleTitle}
                                    </span>
                                </p>
                            </div>
                            <StrategicReportActionsMenu report={report} />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5 shrink-0" />
                                <span className="font-medium text-muted-foreground break-words">
                                    {format(report.createdAt, 'MMM dd, yyyy')}
                                </span>
                            </span>

                            <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <span className="flex items-center gap-1 text-foreground">
                                    Participation Stats
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <UserRound className="h-3.5 w-3.5" />
                                    <span className="font-medium text-foreground">
                                        {report.rateeCount ?? `—`}
                                    </span>
                                    {' ratees'}
                                </span>

                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <UsersRound className="h-3.5 w-3.5" />
                                    <span className="font-medium text-foreground">
                                        {report.respondentCount ?? `—`}
                                    </span>
                                    {' respondents'}
                                </span>

                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <MessageCircle className="h-3.5 w-3.5" />
                                    <span className="font-medium text-foreground">
                                        {report.answerCount ?? `—`}
                                    </span>
                                    {' answers'}
                                </span>

                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <Eye className="h-3.5 w-3.5" />
                                    <span className="font-medium text-foreground">
                                        {report.reviewerCount ?? `—`}
                                    </span>
                                    {' reviewers'}
                                </span>
                            </span>

                            <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <span className="flex items-center gap-1 text-foreground">
                                    Review Stats
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <UsersRound className="h-3.5 w-3.5" />
                                    <span className="font-medium text-foreground">
                                        {report.teamCount ?? `—`}
                                    </span>
                                    {' teams'}
                                </span>

                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <Award className="h-3.5 w-3.5" />
                                    <span className="font-medium text-foreground">
                                        {report.positionCount ?? `—`}
                                    </span>
                                    {' positions'}
                                </span>

                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <Bookmark className="h-3.5 w-3.5" />
                                    <span className="font-medium text-foreground">
                                        {report.competenceCount ?? `—`}
                                    </span>
                                    {' competences'}
                                </span>

                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <FileQuestionMark className="h-3.5 w-3.5" />
                                    <span className="font-medium text-foreground">
                                        {report.questionCount ?? `—`}
                                    </span>
                                    {' questions'}
                                </span>
                            </span>

                            <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <span className="flex items-center gap-1 text-foreground">
                                    Turnout
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <UserRoundPen className="h-3.5 w-3.5 shrink-0" />
                                    <span className="font-medium text-foreground">
                                        {formatNumber(
                                            report.turnoutAvgPctOfRatees,
                                        )}
                                    </span>
                                    {'% ratees'}
                                </span>

                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <UserRoundPen className="h-3.5 w-3.5 shrink-0" />
                                    <span className="font-medium text-foreground">
                                        {formatNumber(
                                            report.turnoutAvgPctOfTeams,
                                        )}
                                    </span>
                                    {'% teams'}
                                </span>

                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <UserRoundPen className="h-3.5 w-3.5 shrink-0" />
                                    <span className="font-medium text-foreground">
                                        {formatNumber(
                                            report.turnoutAvgPctOfOthers,
                                        )}
                                    </span>
                                    {'% others'}
                                </span>
                            </span>

                            <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <span className="flex items-center gap-1 text-foreground">
                                    Rating
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <BookmarkCheck className="h-3.5 w-3.5 shrink-0" />
                                    <span className="font-medium text-foreground">
                                        {formatNumber(
                                            report.competenceGeneralPctSelf,
                                        )}
                                    </span>
                                    {'% by self'}
                                </span>

                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <BookmarkCheck className="h-3.5 w-3.5 shrink-0" />
                                    <span className="font-medium text-foreground">
                                        {formatNumber(
                                            report.competenceGeneralPctTeam,
                                        )}
                                    </span>
                                    {'% by team'}
                                </span>

                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <BookmarkCheck className="h-3.5 w-3.5 shrink-0" />
                                    <span className="font-medium text-foreground">
                                        {formatNumber(
                                            report.competenceGeneralPctOther,
                                        )}
                                    </span>
                                    {'% by others'}
                                </span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop table layout (visible on md+) */}
            <div className="hidden overflow-x-auto lg:block">
                <Table className="w-full table-fixed">
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            {columnOrder.map((id) => {
                                const col = COLUMNS[id];
                                return (
                                    <TableHead
                                        key={id}
                                        className={col.headerClassName}
                                        draggable={id !== 'actions'}
                                        onDragStart={() => handleDragStart(id)}
                                        onDragEnter={() => handleDragEnter(id)}
                                        onDragEnd={handleDragEnd}
                                        onDragOver={(e) => e.preventDefault()}
                                    >
                                        {col.header}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {strategicReports.map((report) => (
                            <TableRow key={report.id}>
                                {columnOrder.map((id) => {
                                    const col = COLUMNS[id];
                                    return (
                                        <TableCell
                                            key={id}
                                            className={col.cellClassName}
                                        >
                                            {col.cell(report)}
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
