'use client';

import { SurveysList } from '@/widgets/feedback360/survey/list/survey-list';
import { useAuth } from '@entities/identity/user/model/auth-context';
import { PageHeader } from '@shared/ui/app-sidebar';
import { notFound } from 'next/navigation';

export default function SurveysPage() {
    const auth = useAuth();

    if (!auth.user) return notFound();

    return (
        <div className="flex flex-col my-2 mx-2 rounded-xl shadow-md bg-background">
            <PageHeader title="Surveys" />
            <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-10 lg:p-10">
                <SurveysList currentUser={auth} />
            </div>
        </div>
    );
}
