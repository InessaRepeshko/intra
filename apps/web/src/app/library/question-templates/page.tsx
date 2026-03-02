'use client';

import { PageHeader } from '@shared/ui/app-sidebar';
import { QuestionTemplateList } from '@widgets/library/question-template/list/question-template-list';

export default function QuestionTemplatesPage() {
    return (
        <div className="flex flex-col my-2 mx-2 rounded-xl shadow-md bg-background">
            <PageHeader title="Question Templates" />
            <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-10 lg:p-10">
                <QuestionTemplateList />
            </div>
        </div>
    );
}
