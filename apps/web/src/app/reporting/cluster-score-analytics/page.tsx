'use client';

import { useAuth } from '@entities/identity/user/model/auth-context';
import { PageHeader } from '@shared/ui/app-sidebar';
import { ClusterScoreAnalyticsPage } from '@widgets/reporting/cluster-score-analytics/list/cluster-score-analytics-page';
import { forbidden, unauthorized } from 'next/navigation';

export default function Page() {
    const auth = useAuth();

    if (!auth.user) return unauthorized();

    if (!auth.isAdmin && !auth.isHR && !auth.isManager) return forbidden();

    return (
        <div className="flex flex-col my-2 mx-2 rounded-xl shadow-md bg-background">
            <PageHeader title="Cluster Score Analytics" />
            <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-10 lg:p-10">
                <ClusterScoreAnalyticsPage currentUser={auth} />
            </div>
        </div>
    );
}
