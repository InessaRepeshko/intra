import {
    mapAnswerDtoToModel,
    type Answer,
} from '@entities/feedback360/answer/model/mappers';
import {
    mapReviewDtoToModel,
    type Review,
} from '@entities/feedback360/review/model/mappers';
import { ReportCommentResponseDto } from '@entities/reporting/individual-report-comment/model/types';
import {
    mapReportDtoToModel,
    type Report,
} from '@entities/reporting/individual-report/model/mappers';

export interface ReportComment extends Omit<
    ReportCommentResponseDto,
    'createdAt'
> {
    createdAt: Date;
}

export function mapReportCommentDtoToModel(
    dto: ReportCommentResponseDto,
): ReportComment {
    return {
        ...dto,
        createdAt: new Date(dto.createdAt),
    };
}

export {
    Answer,
    mapAnswerDtoToModel,
    mapReportDtoToModel,
    mapReviewDtoToModel,
    Report,
    Review,
};
