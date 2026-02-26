import {
    CreateCyclePayload as CreateCyclePayloadDto,
    CycleFilterQuery,
    CycleResponseDto,
    CycleSortField,
    CycleStage,
    SortDirection,
    UpdateCyclePayload as UpdateCyclePayloadDto,
} from '@intra/shared-kernel';

export { CycleSortField, CycleStage, SortDirection };
export type { CycleFilterQuery, CycleResponseDto };

export type CycleQueryDto = CycleFilterQuery & {
    page?: number;
    limit?: number;
};

export type CreateCyclePayload = Omit<
    CreateCyclePayloadDto,
    | 'startDate'
    | 'endDate'
    | 'reviewDeadline'
    | 'approvalDeadline'
    | 'responseDeadline'
> & {
    startDate: string;
    endDate: string;
    reviewDeadline?: string | null;
    approvalDeadline?: string | null;
    responseDeadline?: string | null;
};

export type UpdateCyclePayload = Omit<
    UpdateCyclePayloadDto,
    | 'startDate'
    | 'endDate'
    | 'reviewDeadline'
    | 'approvalDeadline'
    | 'responseDeadline'
> & {
    startDate?: string;
    endDate?: string;
    reviewDeadline?: string | null;
    approvalDeadline?: string | null;
    responseDeadline?: string | null;
};
