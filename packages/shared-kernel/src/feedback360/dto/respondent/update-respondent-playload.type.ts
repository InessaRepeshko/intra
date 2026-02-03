import { RespondentCategory } from '../../enums/respondent-category.enum';
import { ResponseStatus } from '../../enums/response-status.enum';

export type UpdateRespondentPayload = Partial<{
    category: RespondentCategory;
    responseStatus: ResponseStatus;
    respondentNote: string | null;
    hrNote: string | null;
    positionId: number;
    positionTitle: string;
    teamId: number | null;
    teamTitle: string | null;
    invitedAt: Date | null;
    canceledAt: Date | null;
    respondedAt: Date | null;
}>;
