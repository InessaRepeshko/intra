import {
    CompetenceDto,
    CompetenceSearchQuery as CompetenceFilterQuery,
    CompetenceResponseDto,
    CreateCompetencePayload,
    UpdateCompetencePayload,
} from '@intra/shared-kernel';

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
