import {
    UserDto,
    UserResponseDto,
} from 'src/identity/dto/user/user-dto.interface';

export interface TeamMemberBaseDto<TDate = Date> {
    id: number;
    teamId: number;
    memberId: number;
    isPrimary: boolean;
    createdAt: TDate;
}

export type TeamMemberDto = TeamMemberBaseDto<Date> & UserDto;

export type TeamMemberResponseDto = TeamMemberBaseDto<string> & UserResponseDto;
