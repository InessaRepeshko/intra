'use client';

import { RespondentCategory } from '@entities/feedback360/answer/model/types';
import { useAuth } from '@entities/identity/user/model/auth-context';
import { SubmitSurveyForm } from '@features/feedback360/survey/submit-form/ui/SubmitSurveyForm';
import { notFound, unauthorized, useSearchParams } from 'next/navigation';
import { use } from 'react';

function resolveRespondentCategory(rawType: string | null): RespondentCategory {
    switch (rawType?.toLowerCase()) {
        case 'self':
        case 'self_assessment':
            return RespondentCategory.SELF_ASSESSMENT;
        case 'team':
            return RespondentCategory.TEAM;
        case 'other':
            return RespondentCategory.OTHER;
        default:
            return RespondentCategory.TEAM;
    }
}

export default function SurveyFormPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const auth = useAuth();

    if (!auth.user) return unauthorized();

    const resolvedParams = use(params);
    const reviewId = Number(resolvedParams.id);
    const searchParams = useSearchParams();
    const respondentCategory = resolveRespondentCategory(
        searchParams.get('type'),
    );

    if (!Number.isFinite(reviewId) || reviewId <= 0) {
        return notFound();
    }

    return (
        <SubmitSurveyForm
            reviewId={reviewId}
            respondentCategory={respondentCategory}
            currentUser={auth}
        />
    );
}
