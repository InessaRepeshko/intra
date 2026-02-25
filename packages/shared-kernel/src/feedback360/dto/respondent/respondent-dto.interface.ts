import { RespondentCategory } from '../../enums/respondent-category.enum';
import { ResponseStatus } from '../../enums/response-status.enum';

export interface RespondentBaseDto<TDate = Date> {
    id: number;
    reviewId: number;
    respondentId: number;
    fullName: string;
    category: RespondentCategory;
    responseStatus: ResponseStatus;
    respondentNote?: string | null;
    hrNote?: string | null;
    positionId: number;
    positionTitle: string;
    teamId?: number | null;
    teamTitle?: string | null;
    invitedAt?: TDate | null;
    canceledAt?: TDate | null;
    respondedAt?: TDate | null;
    createdAt: TDate;
    updatedAt: TDate;
}

export type RespondentDto = RespondentBaseDto<Date>;

export type RespondentResponseDto = RespondentBaseDto<string>;
