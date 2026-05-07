import {
    addRespondentToReview,
    deleteReviewRespondent,
} from '@entities/feedback360/respondent/api/respondent.api';
import { respondentKeys } from '@entities/feedback360/respondent/api/respondent.queries';
import type { Respondent } from '@entities/feedback360/respondent/model/mappers';
import { RespondentCategory } from '@entities/feedback360/respondent/model/types';
import {
    createReview,
    updateReview,
} from '@entities/feedback360/review/api/review.api';
import { reviewKeys } from '@entities/feedback360/review/api/review.queries';
import {
    addReviewerToReview,
    deleteReviewReviewer,
} from '@entities/feedback360/reviewer/api/reviewer.api';
import { reviewerKeys } from '@entities/feedback360/reviewer/api/reviewer.queries';
import type { Reviewer } from '@entities/feedback360/reviewer/model/mappers';
import { addQuestionToReview } from '@entities/feedback360/survey/api/review-question-relation.api';
import type { User } from '@entities/identity/user/model/mappers';
import type { AuthUser } from '@entities/identity/user/model/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import type { ReviewFormValues } from '../model/review-form.schema';

function extractApiErrorMessage(error: unknown, fallback: string): string {
    if (isAxiosError(error)) {
        const data = error.response?.data as
            | { message?: string | string[] }
            | undefined;
        const message = data?.message;
        if (Array.isArray(message) && message.length > 0) {
            return message.join('; ');
        }
        if (typeof message === 'string' && message.trim().length > 0) {
            return message;
        }
    }
    return fallback;
}

function computeRespondentCategory(
    user: User,
    rateeId: number,
    rateeTeamId?: number | null,
): RespondentCategory {
    if (user.id === rateeId) {
        return RespondentCategory.SELF_ASSESSMENT;
    }
    if (
        rateeTeamId !== null &&
        rateeTeamId !== undefined &&
        user.teamId === rateeTeamId
    ) {
        return RespondentCategory.TEAM;
    }
    return RespondentCategory.OTHER;
}

function buildRespondentPayload(
    user: User,
    rateeId: number,
    rateeTeamId?: number | null,
) {
    const fullName =
        user.fullName ??
        `${user.lastName ?? ''} ${user.firstName ?? ''}`.trim();
    const category = computeRespondentCategory(user, rateeId, rateeTeamId);
    return {
        respondentId: user.id,
        fullName,
        category,
        positionId: user.positionId ?? 0,
        positionTitle: user.positionTitle ?? '',
        teamId: user.teamId ?? null,
        teamTitle: user.teamTitle ?? null,
    };
}

function buildReviewerPayload(user: User) {
    const fullName =
        user.fullName ??
        `${user.lastName ?? ''} ${user.firstName ?? ''}`.trim();
    return {
        reviewerId: user.id,
        fullName,
        positionId: user.positionId ?? 0,
        positionTitle: user.positionTitle ?? '',
        teamId: user.teamId ?? null,
        teamTitle: user.teamTitle ?? null,
    };
}

export function useCreateReviewFormMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            values,
            rateeUser,
            managerUser,
            currentUser,
            respondentUsers,
            reviewerUsers,
            questionTemplateIds,
        }: {
            values: ReviewFormValues;
            rateeUser: User;
            managerUser?: User | null;
            currentUser: AuthUser;
            respondentUsers: User[];
            reviewerUsers: User[];
            questionTemplateIds: number[];
        }) => {
            const review = await createReview({
                rateeId: values.rateeId,
                rateeFullName:
                    rateeUser.fullName ??
                    `${rateeUser.lastName ?? ''} ${rateeUser.firstName ?? ''}`.trim(),
                rateePositionId: rateeUser.positionId ?? 0,
                rateePositionTitle: rateeUser.positionTitle ?? '',
                hrId: values.hrId,
                hrFullName: currentUser.fullName,
                hrNote: values.hrNote || undefined,
                teamId: rateeUser.teamId ?? null,
                teamTitle: rateeUser.teamTitle ?? null,
                managerId: rateeUser.managerId ?? null,
                managerFullName: rateeUser.managerName ?? null,
                managerPositionId: managerUser?.positionId ?? null,
                managerPositionTitle: managerUser?.positionTitle ?? null,
                cycleId: values.cycleId ?? null,
                stage: values.stage,
            });

            await Promise.all(
                respondentUsers.map((user) =>
                    addRespondentToReview(
                        review.id,
                        buildRespondentPayload(
                            user,
                            values.rateeId,
                            rateeUser.teamId ?? null,
                        ),
                    ),
                ),
            );

            await Promise.all(
                reviewerUsers.map((user) =>
                    addReviewerToReview(review.id, buildReviewerPayload(user)),
                ),
            );

            await Promise.all(
                questionTemplateIds.map((questionTemplateId) =>
                    addQuestionToReview(review.id, questionTemplateId),
                ),
            );

            return review;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
            queryClient.invalidateQueries({ queryKey: respondentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: reviewerKeys.lists() });
            toast.success('Review created successfully');
        },
        onError: (error) => {
            toast.error(
                extractApiErrorMessage(error, 'Failed to create review'),
            );
        },
    });
}

export function useUpdateReviewFormMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            values,
            rateeUser,
            managerUser,
            syncMembers,
            respondentUsers,
            reviewerUsers,
            existingRespondents,
            existingReviewers,
        }: {
            id: number;
            values: ReviewFormValues;
            rateeUser?: User | null;
            managerUser?: User | null;
            /** When true, diff and sync respondents/reviewers lists too. */
            syncMembers?: boolean;
            respondentUsers?: User[];
            reviewerUsers?: User[];
            existingRespondents?: Respondent[];
            existingReviewers?: Reviewer[];
        }) => {
            const updated = await updateReview(id, {
                ...(rateeUser
                    ? {
                          rateeId: values.rateeId,
                          rateeFullName:
                              rateeUser.fullName ??
                              `${rateeUser.lastName ?? ''} ${rateeUser.firstName ?? ''}`.trim(),
                          rateePositionId: rateeUser.positionId ?? 0,
                          rateePositionTitle: rateeUser.positionTitle ?? '',
                          teamId: rateeUser.teamId ?? null,
                          teamTitle: rateeUser.teamTitle ?? null,
                          managerId: rateeUser.managerId ?? null,
                          managerFullName: rateeUser.managerName ?? null,
                          managerPositionId: managerUser?.positionId ?? null,
                          managerPositionTitle:
                              managerUser?.positionTitle ?? null,
                      }
                    : {}),
                hrNote: values.hrNote || undefined,
                cycleId: values.cycleId ?? null,
                stage: values.stage,
            });

            if (syncMembers && rateeUser) {
                const rateeTeamId = rateeUser.teamId ?? null;
                const respondentNextIds = (respondentUsers ?? []).map(
                    (u) => u.id,
                );
                const respondentExistingByUserId = new Map(
                    (existingRespondents ?? []).map((r) => [r.respondentId, r]),
                );

                // Users that don't exist yet → simply add with desired category.
                const respondentToAdd = (respondentUsers ?? []).filter(
                    (u) => !respondentExistingByUserId.has(u.id),
                );

                // Users that are no longer in the next list → remove.
                const respondentToRemove = (existingRespondents ?? []).filter(
                    (r) => !respondentNextIds.includes(r.respondentId),
                );

                // Users that exist in both lists but whose category should
                // change (e.g. ratee swap means new ratee must become
                // SELF_ASSESSMENT and the previous ratee, if kept as a
                // respondent, must drop to TEAM/OTHER) → delete + re-add.
                const respondentToRecategorize = (
                    respondentUsers ?? []
                ).flatMap((user) => {
                    const existing = respondentExistingByUserId.get(user.id);
                    if (!existing) return [];
                    const desiredCategory = computeRespondentCategory(
                        user,
                        values.rateeId,
                        rateeTeamId,
                    );
                    if (existing.category === desiredCategory) return [];
                    return [{ existing, user }];
                });

                const reviewerNextIds = (reviewerUsers ?? []).map((u) => u.id);
                const reviewerExistingByUserId = new Map(
                    (existingReviewers ?? []).map((r) => [r.reviewerId, r]),
                );
                const reviewerToAdd = (reviewerUsers ?? []).filter(
                    (u) => !reviewerExistingByUserId.has(u.id),
                );
                const reviewerToRemove = (existingReviewers ?? []).filter(
                    (r) => !reviewerNextIds.includes(r.reviewerId),
                );

                // First: remove everything that has to go away (full removals
                // + recategorization deletions). Done before the re-adds so
                // that any unique-constraints on (reviewId, respondentId) do
                // not collide with an in-flight re-insert.
                await Promise.all([
                    ...respondentToRemove.map((r) =>
                        deleteReviewRespondent(r.id),
                    ),
                    ...respondentToRecategorize.map(({ existing }) =>
                        deleteReviewRespondent(existing.id),
                    ),
                    ...reviewerToRemove.map((r) => deleteReviewReviewer(r.id)),
                ]);

                // Then: add new respondents and re-add recategorized ones with
                // the freshly-computed category, plus any new reviewers.
                await Promise.all([
                    ...respondentToAdd.map((user) =>
                        addRespondentToReview(
                            id,
                            buildRespondentPayload(
                                user,
                                values.rateeId,
                                rateeTeamId,
                            ),
                        ),
                    ),
                    ...respondentToRecategorize.map(({ user }) =>
                        addRespondentToReview(
                            id,
                            buildRespondentPayload(
                                user,
                                values.rateeId,
                                rateeTeamId,
                            ),
                        ),
                    ),
                    ...reviewerToAdd.map((user) =>
                        addReviewerToReview(id, buildReviewerPayload(user)),
                    ),
                ]);
            }

            return updated;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: reviewKeys.detail(variables.id),
            });
            queryClient.invalidateQueries({ queryKey: respondentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: reviewerKeys.lists() });
            toast.success('Review updated successfully');
        },
        onError: (error) => {
            toast.error(
                extractApiErrorMessage(error, 'Failed to update review'),
            );
        },
    });
}
