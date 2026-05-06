'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
    Award,
    Calendar,
    CircleDot,
    LogOut,
    Mail,
    UserCog,
    User as UserIcon,
    Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { logout } from '@entities/identity/user/api/auth.api';
import { useMeQuery } from '@entities/identity/user/api/user.queries';
import { RoleBadge } from '@entities/identity/user/ui/role-badge';
import { StatusBadge } from '@entities/identity/user/ui/status-badge';
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
import { getUserInitialsFromFullName } from '@shared/lib/utils/get-user-initials-from-full-name';

export function ProfileContent() {
    const { data: user, isLoading } = useMeQuery();
    const router = useRouter();
    const queryClient = useQueryClient();

    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.clear();
            toast.success('Logged out successfully');
            router.replace('/signin');
        },
        onError: () => {
            toast.error('Failed to log out. Please try again.');
        },
    });

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6 sm:gap-8 w-full min-w-0">
                <div className="text-sm text-muted-foreground animate-pulse">
                    Loading profile…
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col gap-6 sm:gap-8 w-full min-w-0">
                <div className="text-sm text-muted-foreground">
                    Could not load your profile.
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 sm:gap-8 w-full min-w-0">
            {/* Hero card — identity */}
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
                    <div className="flex flex-col gap-3 text-base sm:text-right">
                        <div className="flex sm:justify-end">
                            <Button
                                type="button"
                                variant="default"
                                className="rounded-xl"
                                onClick={() => logoutMutation.mutate()}
                                disabled={logoutMutation.isPending}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                {logoutMutation.isPending
                                    ? 'Logging out...'
                                    : 'Log out'}
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Personal Information card */}
            <Card className="border-border p-4 sm:p-6">
                <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-foreground text-lg break-words">
                        Personal Information
                    </CardTitle>
                    <CardDescription className="text-base">
                        Your account details as stored in the platform.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 flex flex-row gap-4 flex-wrap items-stretch justify-between w-full">
                    <div className="flex flex-col flex-wrap gap-4 w-full flex-1">
                        <ProfileField
                            icon={UserIcon}
                            label="Full Name"
                            value={user.fullName}
                        />
                        <ProfileField
                            icon={Award}
                            label="Position"
                            value={user.positionTitle || '—'}
                        />
                        <ProfileField
                            icon={Users}
                            label="Team"
                            value={user.teamTitle || '—'}
                        />
                        <ProfileField
                            icon={Mail}
                            label="Email"
                            value={user.email}
                        />
                    </div>
                    <div className="flex flex-col flex-wrap gap-4 w-full flex-1">
                        <ProfileField
                            icon={UserCog}
                            label="Manager"
                            value={user.managerName || '—'}
                        />
                        <ProfileField icon={CircleDot} label="Status">
                            <div className="flex items-center gap-2 justify-start">
                                <StatusBadge status={user.status} />
                            </div>
                        </ProfileField>
                        <ProfileField
                            icon={Calendar}
                            label="Member Since"
                            value={format(user.createdAt, 'MMM dd, yyyy')}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function ProfileField({
    icon: Icon,
    label,
    value,
    children,
}: {
    icon: React.ElementType;
    label: string;
    value?: string;
    children?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1 min-w-0">
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Icon className="shrink-0 h-4 w-4" />
                {label}
            </span>
            {children ?? (
                <span className="text-foreground break-words">{value}</span>
            )}
        </div>
    );
}
