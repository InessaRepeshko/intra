'use client';

import { PageHeader } from '@shared/ui/app-sidebar';
import { AnalyticsList } from '@widgets/reporting/analytics/list/analitycs-list';

export default function AnalyticsPage() {
    return (
        <div className="flex flex-col my-2 mx-2 rounded-xl shadow-md bg-background">
            <PageHeader title="Analytics" />
            <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-10 lg:p-10">
                <AnalyticsList />
            </div>
        </div>
    );
}
