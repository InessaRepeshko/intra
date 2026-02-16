import {
    CycleFilterQuery,
    CycleResponseDto,
    CycleSortField,
    CycleStage,
} from '@intra/shared-kernel';

export enum SortDirection {
    ASC = 'ASC',
    DESC = 'DESC',
}

export { CycleSortField, CycleStage };

export type CycleResponse = CycleResponseDto;

export type CycleQueryDto = CycleFilterQuery & {
    page?: number;
    limit?: number;
};
