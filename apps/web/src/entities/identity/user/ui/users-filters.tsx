'use client';

import {
    Award,
    Flag,
    RotateCcw,
    Search,
    UserRoundKey,
    Users,
} from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import {
    IdentityRole,
    IdentityStatus,
} from '@entities/identity/user/model/types';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { cn } from '@shared/lib/utils/cn';
import { DateRangePicker } from '@shared/ui/date-range-picker';
import { MultiSelect } from '@shared/ui/multi-select';
import { roleConfig } from './role-badge';
import { statusConfig } from './status-badge';

interface UsersFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    statuses: string[];
    onStatusesChange: (value: string[]) => void;
    roles: string[];
    onRolesChange: (value: string[]) => void;
    dateRange: DateRange | undefined;
    onDateRangeChange: (range: DateRange | undefined) => void;
    teams: string[];
    onTeamsChange: (value: string[]) => void;
    positions: string[];
    onPositionsChange: (value: string[]) => void;
    statusOptions: IdentityStatus[];
    roleOptions: IdentityRole[];
    teamOptions: { id: string | number; title: string }[];
    positionOptions: { id: string | number; title: string }[];
    onReset: () => void;
}

export function UsersFilters({
    search,
    onSearchChange,
    statuses,
    onStatusesChange,
    roles,
    onRolesChange,
    dateRange,
    onDateRangeChange,
    teams,
    onTeamsChange,
    positions,
    onPositionsChange,
    statusOptions,
    roleOptions,
    teamOptions,
    positionOptions,
    onReset,
}: UsersFiltersProps) {
    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-start flex-wrap">
            <div className="relative w-full flex-1 md:min-w-[300px] lg:max-w-sm">
                <Search
                    className={cn(
                        'absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2',
                        !search ? 'text-muted-foreground' : 'text-foreground',
                    )}
                />
                <Input
                    placeholder="Search by full name or email..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9 truncate text-sm"
                />
            </div>

            <MultiSelect
                options={statusOptions.map((opt) => ({
                    label: statusConfig[opt]?.label || String(opt),
                    value: String(opt),
                    badgeClassName: statusConfig[opt]?.className,
                }))}
                value={statuses}
                onValueChange={onStatusesChange}
                placeholder="All Statuses"
                emptyText="No statuses found"
                className="w-full lg:max-w-[300px] lg:w-auto min-w-[150px]"
                showClear
                icon={<Flag className="h-4 w-4" />}
            />

            <MultiSelect
                options={roleOptions.map((opt) => ({
                    label: roleConfig[opt]?.label || String(opt),
                    value: String(opt),
                    badgeClassName: roleConfig[opt]?.className,
                }))}
                value={roles}
                onValueChange={onRolesChange}
                placeholder="All Roles"
                emptyText="No roles found"
                className="w-full lg:max-w-[300px] lg:w-auto min-w-[150px]"
                showClear
                icon={<UserRoundKey className="h-4 w-4" />}
            />

            <MultiSelect
                options={positionOptions.map((opt) => ({
                    label: opt.title,
                    value: String(opt.id),
                }))}
                value={positions}
                onValueChange={onPositionsChange}
                placeholder="All Positions"
                emptyText="No positions found"
                className="w-full lg:max-w-[300px] lg:w-auto min-w-[150px]"
                showClear
                icon={<Award className="h-4 w-4" />}
            />

            <MultiSelect
                options={teamOptions.map((opt) => ({
                    label: opt.title,
                    value: String(opt.id),
                }))}
                value={teams}
                onValueChange={onTeamsChange}
                placeholder="All Teams"
                emptyText="No teams found"
                className="w-full lg:max-w-[300px] lg:w-auto min-w-[150px]"
                showClear
                icon={<Users className="h-4 w-4" />}
            />

            <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={onDateRangeChange}
            />

            <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="text-muted-foreground hover:text-foreground"
            >
                <RotateCcw className="mr-1 h-4 w-4" />
                Reset
            </Button>
        </div>
    );
}
