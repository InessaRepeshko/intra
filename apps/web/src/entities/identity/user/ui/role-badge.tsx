import { IdentityRole } from '@entities/identity/user/model/types';
import { cn } from '@shared/lib/utils/cn';

export const roleConfig: Record<
    IdentityRole,
    { label: string; className: string }
> = {
    [IdentityRole.ADMIN]: {
        label: 'Admin',
        className: 'bg-orange-100 text-orange-800 border-orange-200',
    },
    [IdentityRole.HR]: {
        label: 'HR',
        className: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
    },
    [IdentityRole.MANAGER]: {
        label: 'Manager',
        className: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    },
    [IdentityRole.EMPLOYEE]: {
        label: 'Employee',
        className: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    },
};

export function RoleBadge({ role }: { role: IdentityRole }) {
    const config = roleConfig[role];

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                config.className,
            )}
        >
            {config.label}
        </span>
    );
}
