import type { RespondentResponseDto } from '@entities/feedback360/respondent/model/types';
import { toDate } from '@shared/lib/utils/mappers/toDate';

export interface Respondent extends Omit<
    RespondentResponseDto,
    'invitedAt' | 'canceledAt' | 'respondedAt' | 'createdAt' | 'updatedAt'
> {
    invitedAt: Date | null;
    canceledAt: Date | null;
    respondedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export function mapRespondentDtoToModel(
    dto: RespondentResponseDto,
): Respondent {
    return {
        ...dto,
        invitedAt: toDate(dto.invitedAt),
        canceledAt: toDate(dto.canceledAt),
        respondedAt: toDate(dto.respondedAt),
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
    };
}
