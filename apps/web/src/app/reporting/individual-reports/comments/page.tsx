'use client';

import { PageHeader } from '@shared/ui/app-sidebar';
import { IndividualReportCommentList } from '@widgets/reporting/individual-report-comment/list/individual-report-comment-list';

export default function IndividualReportCommentsPage() {
    return (
        <div className="flex flex-col my-2 mx-2 rounded-xl shadow-md bg-background">
            <PageHeader title="Individual Reports Comments" />
            <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-10 lg:p-10">
                <IndividualReportCommentList />
            </div>
        </div>
    );
}
