import { OmitType } from '@nestjs/swagger';
import { User } from '../../models/user.entity';

export class UserResponseDto extends OmitType(User, ['passwordHash'] as const) {}