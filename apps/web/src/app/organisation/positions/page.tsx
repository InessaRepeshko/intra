'use client';

import { PageHeader } from '@shared/ui/app-sidebar';
import { PositionList } from '@widgets/organisation/position/list/position-list';

export default function PositionsPage() {
    return (
        <div className="flex flex-col my-2 mx-2 rounded-xl shadow-md bg-background">
            <PageHeader title="Positions" />
            <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-10 lg:p-10">
                <PositionList />
            </div>
        </div>
    );
}
