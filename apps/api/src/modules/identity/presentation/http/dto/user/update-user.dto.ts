import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { UsersStatus } from 'src/modules/identity/domain/user/users-status.enum';
import { IsEnum, IsOptional } from 'class-validator';
import { ToOptionalEnum } from 'src/common/transforms/query-sanitize.transform';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(
    OmitType(CreateUserDto, ['email'] as const)
) {
    @ToOptionalEnum(UsersStatus)
    @IsOptional()
    @IsEnum(UsersStatus)
    @ApiProperty({
        required: false,
        description: 'The status of the user',
        enum: UsersStatus,
        example: UsersStatus.ACTIVE,
    })
    status?: UsersStatus;

}
