import { ApiProperty } from '@nestjs/swagger';
import { ExposeBasic } from 'src/common/serialisation/public.serialisation.decorator';
import { User } from './user.entity';
import { Position } from './position.entity';

export class PositionWithRelations extends Position {
    @ApiProperty({
        description: 'The users with this position',
        type: () => [User],
        required: false,
    })
    @ExposeBasic()
    users?: User[];
}
