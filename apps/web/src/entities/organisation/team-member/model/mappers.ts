import { TeamMemberResponseDto } from './types';

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
