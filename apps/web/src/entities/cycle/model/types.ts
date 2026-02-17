import {
    CycleFilterQuery,
    CycleResponseDto,
    CycleSortField,
    CycleStage,
} from '@intra/shared-kernel';

export enum SortDirection {
    ASC = 'asc',
    DESC = 'desc',
}

export { CycleSortField, CycleStage };

export type CycleResponse = CycleResponseDto;

export type CycleQueryDto = CycleFilterQuery & {
    page?: number;
    limit?: number;
};
