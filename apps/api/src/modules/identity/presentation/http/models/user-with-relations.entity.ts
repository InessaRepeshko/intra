import { ApiProperty } from '@nestjs/swagger';
import { ExposeBasic } from 'src/common/serialisation/public.serialisation.decorator';
import { Position } from './position.entity';
import { Team } from './team.entity';
import { User } from './user.entity';

export class UserWithRelations extends User {
    @ApiProperty({
        description: 'The position of the user',
        type: () => Position,
        required: false,
    })
    @ExposeBasic()
    position?: Position;

    @ApiProperty({
        description: 'The team of the user',
        type: () => Team,
        required: false,
    })
    @ExposeBasic()
    team?: Team;

    @ApiProperty({
        description: 'The manager of the user',
        type: () => User,
        required: false,
    })
    @ExposeBasic()
    manager?: User;

    @ApiProperty({
        description: 'The subordinates of the user',
        type: () => [User],
        required: false,
    })
    @ExposeBasic()
    subordinates?: User[];

    @ApiProperty({
        description: 'The teams led by the user',
        type: () => [Team],
        required: false,
    })
    @ExposeBasic()
    teamsLed?: Team[];
}
