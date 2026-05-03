'use client';

import { useAuth } from '@entities/identity/user/model/auth-context';
import { IdentityRole } from '@entities/identity/user/model/types';
import { PageHeader } from '@shared/ui/app-sidebar';
import { CyclesList } from '@widgets/feedback360/cycle/list/cycle-list';
import { forbidden, notFound } from 'next/navigation';

export default function CyclesPage() {
    const auth = useAuth();

    if (!auth.user) return notFound();

    if (!auth.hasRole(IdentityRole.ADMIN, IdentityRole.HR)) return forbidden();

    return (
        <div className="flex flex-col my-2 mx-2 rounded-xl shadow-md bg-background">
            <PageHeader title="Cycles" />
            <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-10 lg:p-10">
                <CyclesList currentUser={auth} />
            </div>
        </div>
    );
}
