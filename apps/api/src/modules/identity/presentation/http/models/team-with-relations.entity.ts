import { ApiProperty } from '@nestjs/swagger';
import { ExposeBasic } from 'src/common/serialisation/public.serialisation.decorator';
import { User } from './user.entity';
import { Team } from './team.entity';

export class TeamWithRelations extends Team {
    @ApiProperty({
        description: 'The head user of the team',
        type: () => User,
        required: false,
    })
    @ExposeBasic()
    head?: User;

    @ApiProperty({
        description: 'The members of the team',
        type: () => [User],
        required: false,
    })
    @ExposeBasic()
    members?: User[];
}
