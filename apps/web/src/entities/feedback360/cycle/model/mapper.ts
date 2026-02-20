import type { CycleResponseDto } from '@entities/feedback360/cycle/model/types';

/**
 * Frontend Cycle model with Date objects instead of ISO strings.
 */
export interface Cycle extends Omit<
    CycleResponseDto,
    | 'startDate'
    | 'endDate'
    | 'reviewDeadline'
    | 'approvalDeadline'
    | 'responseDeadline'
    | 'createdAt'
    | 'updatedAt'
> {
    startDate: Date;
    endDate: Date;
    reviewDeadline: Date | null;
    approvalDeadline: Date | null;
    responseDeadline: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

function toDate(value: string | null | undefined): Date | null {
    if (!value) return null;
    return new Date(value);
}

/**
 * Maps a backend CycleResponseDto (dates as ISO strings) to
 * the frontend Cycle model (dates as Date objects).
 */
export function mapCycleDtoToModel(dto: CycleResponseDto): Cycle {
    return {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        reviewDeadline: toDate(dto.reviewDeadline),
        approvalDeadline: toDate(dto.approvalDeadline),
        responseDeadline: toDate(dto.responseDeadline),
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
    };
}
