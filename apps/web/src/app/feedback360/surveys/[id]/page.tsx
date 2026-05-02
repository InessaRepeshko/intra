'use client';

import { RespondentCategory } from '@entities/feedback360/answer/model/types';
import { SubmitSurveyForm } from '@features/feedback360/survey/submit-form/ui/SubmitSurveyForm';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';
import { notFound } from 'next/navigation';
import { PageHeader } from '@shared/ui/app-sidebar';

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
        />
    );
}
