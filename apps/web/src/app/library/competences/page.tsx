'use client';

import { PageHeader } from '@shared/ui/app-sidebar';
import { CompetenceList } from '@widgets/library/competence/list/competence-list';

export default function CompetencesPage() {
    return (
        <div className="flex flex-col my-2 mx-2 rounded-xl shadow-md bg-background">
            <PageHeader title="Competences" />
            <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-10 lg:p-10">
                <CompetenceList />
            </div>
        </div>
    );
}
