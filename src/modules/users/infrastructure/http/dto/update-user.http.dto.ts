import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserHttpDto } from './create-user.http.dto';

export class UpdateUserHttpDto extends PartialType(OmitType(CreateUserHttpDto, ['email', 'password'] as const)) {}


