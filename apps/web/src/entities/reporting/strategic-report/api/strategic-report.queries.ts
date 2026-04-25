import { fetchCycleById } from '@entities/feedback360/cycle/api/cycle.api';
import {
    Cycle,
    mapCycleDtoToModel,
} from '@entities/feedback360/cycle/model/mappers';
import { fetchReviewRespondents } from '@entities/feedback360/respondent/api/respondent.api';
import { fetchReviewById, fetchReviews } from '@entities/feedback360/review/api/review.api';
import {
    type Review,
    mapReviewDtoToModel,
} from '@entities/feedback360/review/model/mappers';
import { fetchUserById } from '@entities/identity/user/api/user.api';
import {
    type User,
    mapUserResponseDtoToModel,
} from '@entities/identity/user/model/mappers';
import { fetchTeamTitlesByIds } from '@entities/organisation/team/api/team.api';
import { fetchReports, fetchReportByReviewId } from '@entities/reporting/individual-report/api/individual-report.api';
import { useQueries, useQuery } from '@tanstack/react-query';
import {
    type StrategicReport,
    type StrategicReportAnalytics,
    mapStrategicReportAnalyticsDtoToModel,
    mapStrategicReportDtoToModel,
} from '../model/mappers';
import { StrategicReportFilterQuery } from '../model/types';
import {
    fetchStrategicReportAnalyticsByReportId,
    fetchStrategicReportById,
    fetchStrategicReports,
} from './strategic-report.api';
import { fetchPositionById } from '@entities/organisation/position/api/position.api';
import { type Report as IndividualReport, mapReportDtoToModel as mapIndividualReportDtoToModel } from '@entities/reporting/individual-report/model/mappers';
import { fetchReports as fetchIndividualReports } from '@entities/reporting/individual-report/api/individual-report.api';



export const strategicReportKeys = {
    all: ['strategic-reports'] as const,
    lists: () => [...strategicReportKeys.all, 'list'] as const,
    list: (filters?: StrategicReportFilterQuery) =>
        [...strategicReportKeys.lists(), filters ?? {}] as const,
    details: () => [...strategicReportKeys.all, 'detail'] as const,
    detail: (id: number) => [...strategicReportKeys.details(), id] as const,
    allStrategicReportAnalytics: () =>
        [...strategicReportKeys.all, 'allStrategicReportAnalytics'] as const,
    strategicReportAnalytics: (analyticsId: number) =>
        [
            ...strategicReportKeys.allStrategicReportAnalytics(),
            analyticsId,
        ] as const,
    reviews: () => [...strategicReportKeys.all, 'reviews'] as const,
    review: (reviewId: number) =>
        [...strategicReportKeys.reviews(), reviewId] as const,
    cycles: () => [...strategicReportKeys.all, 'cycles'] as const,
    cycle: (cycleId: number) =>
        [...strategicReportKeys.cycles(), cycleId] as const,
    allRatees: () => [...strategicReportKeys.all, 'ratees'] as const,
    ratees: (cycleId: number) =>
        [...strategicReportKeys.allRatees(), cycleId] as const,
    allTeamTitles: () => [...strategicReportKeys.all, 'allTeamTitles'] as const,
    teamTitles: (cycleId: number) =>
        [...strategicReportKeys.allTeamTitles(), cycleId] as const,
    allIndividualReports: () =>
        [...strategicReportKeys.all, 'allIndividualReports'] as const,
    individualReports: (cycleId: number) =>
        [...strategicReportKeys.allIndividualReports(), cycleId] as const,
};

export function useStrategicReportsQuery(params?: StrategicReportFilterQuery) {
    return useQuery<StrategicReport[]>({
        queryKey: strategicReportKeys.list(params),
        queryFn: async () => {
            const dtos = await fetchStrategicReports(params);
            return dtos.map(mapStrategicReportDtoToModel);
        },
    });
}

export function useStrategicReportQuery(id: number) {
    return useQuery<StrategicReport>({
        queryKey: strategicReportKeys.detail(id),
        queryFn: async () => {
            const dto = await fetchStrategicReportById(id);
            return mapStrategicReportDtoToModel(dto);
        },
        enabled: id > 0,
    });
}

export function useStrategicReportAnalyticsQuery(analyticsId: number) {
    return useQuery<StrategicReportAnalytics[]>({
        queryKey: strategicReportKeys.strategicReportAnalytics(analyticsId),
        queryFn: async () => {
            const dtos =
                await fetchStrategicReportAnalyticsByReportId(analyticsId);
            return dtos.map(mapStrategicReportAnalyticsDtoToModel);
        },
        enabled: analyticsId > 0,
    });
}

export function useAllReportAnalyticsQuery(analyticsIds: number[]) {
    const queries = useQueries({
        queries: analyticsIds.map((analyticsId, index) => ({
            queryKey: strategicReportKeys.strategicReportAnalytics(analyticsId),
            queryFn: () =>
                fetchStrategicReportAnalyticsByReportId(analyticsIds[index]),
        })),
    });

    const strategicReportAnalytics: Record<number, StrategicReportAnalytics[]> =
        {};
    analyticsIds.forEach((analyticsId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            strategicReportAnalytics[analyticsId] = result.data.map(
                mapStrategicReportAnalyticsDtoToModel,
            );
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { strategicReportAnalytics, isLoading };
}

export function useStrategicReportReviewsQuery(reviewIds: number[]) {
    return useQueries<Review[]>({
        queries: reviewIds.map((reviewId) => ({
            queryKey: strategicReportKeys.review(reviewId),
            queryFn: async () => {
                const dto = await fetchReviewById(reviewId);
                return mapReviewDtoToModel(dto);
            },
            enabled: reviewId > 0,
        })),
    });
}

export function useStrategicReportReviewQuery(reviewId: number) {
    return useQuery<Review>({
        queryKey: strategicReportKeys.review(reviewId),
        queryFn: async () => {
            const dto = await fetchReviewById(reviewId);
            return mapReviewDtoToModel(dto);
        },
        enabled: reviewId > 0,
    });
}

export function useStrategicReportCyclesQuery(cycleIds: number[]) {
    return useQueries<Cycle[]>({
        queries: cycleIds.map((cycleId) => ({
            queryKey: strategicReportKeys.cycle(cycleId),
            queryFn: async () => {
                const dto = await fetchCycleById(cycleId);
                return mapCycleDtoToModel(dto);
            },
            enabled: cycleId > 0,
        })),
    });
}

export function useStrategicReportCycleQuery(cycleId: number) {
    return useQuery<Cycle>({
        queryKey: strategicReportKeys.cycle(cycleId),
        queryFn: async () => {
            const dto = await fetchCycleById(cycleId);
            return mapCycleDtoToModel(dto);
        },
        enabled: cycleId > 0,
    });
}

export function useStrategicReportRateesQuery(cycleId: number) {
    return useQuery<User[]>({
        queryKey: strategicReportKeys.ratees(cycleId),
        queryFn: async () => {
            const reports = await fetchReports({ cycleId: cycleId });
            const reviewIds = reports.map((report) => report.reviewId);
            const reviews = await Promise.all(
                reviewIds.map((reviewId) => fetchReviewById(reviewId)),
            );
            const rateeIds = reviews.map((review) => review.rateeId);
            const users = await Promise.all(
                rateeIds.map((rateeId) => fetchUserById(rateeId)),
            );
            const positions = await Promise.all(
                users.map((user) => user.positionId ? fetchPositionById(user.positionId) : null),
            );
            const usersData = users.map(mapUserResponseDtoToModel);
            usersData.forEach((user, index) => {
                user.positionTitle = positions.find((position) => position?.id === user.positionId)?.title || '';
            });
            return usersData;
        },
        enabled: cycleId > 0,
    });
}

export function useAllStrategicReportRateesQuery(cycleIds: number[]) {
    const uniqueCycleIds = [...new Set(cycleIds)];

    const queries = useQueries({
        queries: uniqueCycleIds.map((cycleId) => ({
            queryKey: strategicReportKeys.ratees(cycleId),
            queryFn: async () => {
                const reports = await fetchReports({ cycleId: cycleId });
                const reviewIds = reports.map((report) => report.reviewId);
                const reviews = await Promise.all(
                    reviewIds.map((reviewId) => fetchReviewById(reviewId)),
                );
                const rateeIds = [
                    ...new Set(reviews.map((review) => review.rateeId)),
                ];
                const users = await Promise.all(
                    rateeIds.map((rateeId) => fetchUserById(rateeId)),
                );
                const positions = await Promise.all(
                    users.map((user) => user.positionId ? fetchPositionById(user.positionId) : null),
                );
                const usersData = users.map(mapUserResponseDtoToModel);
                usersData.forEach((user, index) => {
                    user.positionTitle = positions.find((position) => position?.id === user.positionId)?.title || '';
                });
                return usersData;
            },
            enabled: cycleId > 0,
        })),
    });

    const ratees: { cycleId: number; ratees: User[] }[] = [];

    uniqueCycleIds.forEach((cycleId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            ratees.push({
                cycleId,
                ratees:
                    result.data?.sort((a, b) =>
                        (a.fullName ?? '').localeCompare(b.fullName ?? ''),
                    ) ?? [],
            });
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { ratees, isLoading };
}

export function useStrategicReportTeamTitlesQuery(cycleId: number) {
    return useQuery<{ id: number; title: string }[]>({
        queryKey: strategicReportKeys.teamTitles(cycleId),
        queryFn: async () => {
            const reports = await fetchReports({ cycleId: cycleId });
            const reviewIds = reports.map((report) => report.reviewId);
            const reviews = await Promise.all(
                reviewIds.map((reviewId) => fetchReviewById(reviewId)),
            );
            const teamIds = reviews.map((review) => review.teamId);

            const reviewRespondents = await Promise.all(
                reviewIds.map(async (reviewId) => {
                    const respondents = await fetchReviewRespondents(reviewId);
                    return { reviewId, respondents };
                }),
            );
            reviewRespondents.forEach((review) =>
                review.respondents.forEach((respondent) =>
                    teamIds.push(respondent.teamId),
                ),
            );
            const uniqueTeamIds = Array.from(new Set(teamIds)).filter(
                (t): t is number => t !== undefined && t !== null && t > 0,
            );

            const teams = await fetchTeamTitlesByIds(uniqueTeamIds);
            return teams;
        },
        enabled: cycleId > 0,
    });
}

export function useStrategicReportAllTeamTitlesQuery(cycleIds: number[]) {
    const uniqueCycleIds = [...new Set(cycleIds)];

    const queries = useQueries({
        queries: uniqueCycleIds.map((cycleId) => ({
            queryKey: strategicReportKeys.teamTitles(cycleId),
            queryFn: async () => {
                const reports = await fetchReports({ cycleId: cycleId });
                const reviewIds = reports.map((report) => report.reviewId);
                const reviews = await Promise.all(
                    reviewIds.map((reviewId) => fetchReviewById(reviewId)),
                );
                const teamIds = reviews.map((review) => review.teamId);

                const reviewRespondents = await Promise.all(
                    reviewIds.map(async (reviewId) => {
                        const respondents =
                            await fetchReviewRespondents(reviewId);
                        return { reviewId, respondents };
                    }),
                );
                reviewRespondents.forEach((review) =>
                    review.respondents.forEach((respondent) =>
                        teamIds.push(respondent.teamId),
                    ),
                );
                const uniqueTeamIds = Array.from(new Set(teamIds)).filter(
                    (t): t is number => t !== undefined && t !== null && t > 0,
                );

                const teams = await fetchTeamTitlesByIds(uniqueTeamIds);
                return teams;
            },
            enabled: cycleId > 0,
        })),
    });

    const teamTitles: Record<number, { id: number; title: string }[]> = {};

    uniqueCycleIds.forEach((cycleId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            teamTitles[cycleId] = result.data?.sort((a, b) =>
                a.title.localeCompare(b.title),
            );
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { teamTitles, isLoading };
}

export function useStrategicReportIndividualReportsQuery(cycleId: number) {
    return useQuery<{rateeId: number, individualReport: IndividualReport}[]>({
        queryKey: strategicReportKeys.individualReports(cycleId),
        queryFn: async () => {
            const reviews = await fetchReviews({ cycleId: cycleId });
            const reviewIds = reviews.map((review) => {return {id: review.id, rateeId: review.rateeId}});
            const reports: {rateeId: number, individualReport: IndividualReport}[] = [];
            for (const reviewId of reviewIds) {
                const report = await fetchReportByReviewId(reviewId.id);
                reports.push({
                    rateeId: reviewId.rateeId, 
                    individualReport: mapIndividualReportDtoToModel(report)
                });
            }

            return reports;
        },
        enabled: cycleId > 0,
    });
}
