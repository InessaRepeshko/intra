import { ApiProperty } from '@nestjs/swagger';
import {
    CommentSentiment,
    RespondentCategory,
} from '@intra/shared-kernel';

export class ReportCommentResponse {
    @ApiProperty()
    id!: number;

    @ApiProperty()
    reportId!: number;

    @ApiProperty({ required: false, nullable: true })
    comment?: string | null;

    @ApiProperty({
        enum: CommentSentiment,
        description: 'Detected sentiment of the comment',
    })
    commentSentiment!: CommentSentiment;

    @ApiProperty({ required: false, type: 'number', nullable: true })
    numberOfMentions?: number | null;

    @ApiProperty({ enum: RespondentCategory })
    respondentCategory!: RespondentCategory;

    @ApiProperty()
    createdAt!: Date;
}
