import {
    CompetenceDto,
    CompetenceSearchQuery as CompetenceFilterQuery,
    CompetenceResponseDto,
    CompetenceSortField,
    CreateCompetencePayload,
    SortDirection,
    UpdateCompetencePayload,
} from '@intra/shared-kernel';

export { CompetenceSortField, SortDirection };

export type {
    CompetenceDto,
    CompetenceFilterQuery,
    CompetenceResponseDto,
    CreateCompetencePayload,
    UpdateCompetencePayload,
};

export type CompetenceQueryDto = CompetenceFilterQuery & {
    page?: number;
    limit?: number;
};
