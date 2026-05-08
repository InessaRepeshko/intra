import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';

export class AttachQuestionToReviewDto {
    @ApiProperty({
        example: 10,
        description: 'ID of the question template from the library',
        type: 'number',
        required: true,
    })
    @ToOptionalInt({ min: 1 })
    @IsInt()
    @Min(1)
    questionTemplateId!: number;
}
