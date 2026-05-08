'use client';

import { PageHeader } from '@shared/ui/app-sidebar';
import { TeamList } from '@widgets/organisation/team/list/team-list';

export default function TeamsPage() {
    return (
        <div className="flex flex-col my-2 mx-2 rounded-xl shadow-md bg-background">
            <PageHeader title="Teams" />
            <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-10 lg:p-10">
                <TeamList />
            </div>
        </div>
    );
}
