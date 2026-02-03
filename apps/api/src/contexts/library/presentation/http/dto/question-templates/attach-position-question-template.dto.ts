import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';

export class AttachPositionQuestionTemplateDto {
    @ApiProperty({
        description: 'Position id to link',
        example: 5,
        type: 'number',
    })
    @ToOptionalInt({ min: 1 })
    @IsInt()
    @Min(1)
    positionId!: number;
}
