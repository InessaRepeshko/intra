'use client';

import { PageHeader } from '@shared/ui/app-sidebar';
import { ClusterScoreAnalyticsList } from '@widgets/reporting/cluster-score-analytics/list/cluster-score-analytics-list';

export default function ClusterScoreAnalyticsPage() {
    return (
        <div className="flex flex-col my-2 mx-2 rounded-xl shadow-md bg-background">
            <PageHeader title="Cluster Score Analytics" />
            <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-10 lg:p-10">
                <ClusterScoreAnalyticsList />
            </div>
        </div>
    );
}
