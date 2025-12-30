import { ApiProperty } from '@nestjs/swagger';
import {
    ExposeBasic,
    ExposeConfidential,
    ExposeSystemic,
} from '../../../../../common/serialisation/public.serialisation.decorator';
import { Feedback360Stage } from '../../../domain/enums/feedback360-stage.enum';

export class Feedback360 {
    @ApiProperty({
        description: 'The ID of the feedback360',
        example: 1,
    })
    @ExposeBasic()
    id: number;

    @ApiProperty({
        description: 'The ID of the ratee',
        example: 1,
    })
    @ExposeConfidential()
    rateeId: number;

    @ApiProperty({
        description: 'The note of the ratee',
        example: 'The ratee note',
    })
    @ExposeConfidential()
    rateeNote: string | null;

    @ApiProperty({
        description: 'The ID of the position',
        example: 1,
    })
    @ExposeBasic()
    positionId: number;

    @ApiProperty({
        description: 'The ID of the HR',
        example: 1,
    })
    @ExposeConfidential()
    hrId: number;

    @ApiProperty({
        description: 'The note of the HR',
        example: 'The HR note',
    })
    @ExposeConfidential()
    hrNote: string | null;

    @ApiProperty({
        description: 'The ID of the cycle',
        example: 1,
    })
    @ExposeBasic()
    cycleId: number | null;

    @ApiProperty({
        description: 'The stage of the feedback360',
        example: Feedback360Stage.VERIFICATION_BY_HR,
        enum: Feedback360Stage,
    })
    @ExposeConfidential()
    stage: Feedback360Stage;

    @ApiProperty({
        description: 'The ID of the report',
        example: 1,
    })
    @ExposeConfidential()
    reportId: number | null;

    @ApiProperty({
        description: 'The created at date of the feedback360',
        example: '2021-01-01',
    })
    @ExposeSystemic()
    createdAt: Date;

    @ApiProperty({
        description: 'The updated at date of the feedback360',
        example: '2021-01-01',
    })
    @ExposeSystemic()
    updatedAt: Date;
}
