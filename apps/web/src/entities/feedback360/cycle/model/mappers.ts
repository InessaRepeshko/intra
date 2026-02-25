import type { CycleResponseDto } from '@entities/feedback360/cycle/model/types';
import { toDate } from '@shared/lib/utils/mappers/toDate';

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
