import {
    User,
    mapUserResponseDtoToModel,
} from '@entities/identity/user/model/mappers';
import { TeamMemberResponseDto, UserResponseDto } from './types';

export interface TeamMember extends Omit<TeamMemberResponseDto, 'createdAt'> {
    createdAt: Date;
}

export function mapTeamMemberDtoToModel(
    dto: TeamMemberResponseDto,
): TeamMember {
    return {
        ...dto,
        createdAt: new Date(dto.createdAt),
    };
}

export interface UserTeamMember extends Omit<
    TeamMemberResponseDto,
    'createdAt'
> {
    createdAt: Date;
    user: User | null;
}

export function mapUserTeamMemberDtoToModel(
    dto: TeamMemberResponseDto & { user: UserResponseDto | null },
): UserTeamMember {
    return {
        id: dto.id,
        teamId: dto.teamId,
        memberId: dto.memberId,
        isPrimary: dto.isPrimary,
        createdAt: new Date(dto.createdAt),
        user: dto.user ? mapUserResponseDtoToModel(dto.user) : null,
    };
}
