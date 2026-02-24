'use client';

import { PageHeader } from '@shared/ui/app-sidebar';
import { CyclesList } from '@widgets/feedback360/cycle/list/cycle-list';

export default function CyclesPage() {
    return (
        <div className="flex flex-col my-2 mx-2 rounded-xl shadow-md bg-background">
            <PageHeader title="Cycles" />
            <div className="flex flex-col gap-6 p-6">
                <CyclesList />
            </div>
        </div>
    );
}
