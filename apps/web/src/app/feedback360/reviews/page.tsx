'use client';

import { PageHeader } from '@shared/ui/app-sidebar';
// import { ReviewsList } from '@widgets/feedback360/review/list/review-list';

export default function ReviewsPage() {
    return (
        <div className="flex flex-col my-2 mx-2 rounded-xl shadow-md bg-background">
            <PageHeader title="Reviews" />
            <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-10 lg:p-10">
                {/* <ReviewsList /> */}
            </div>
        </div>
    );
}
