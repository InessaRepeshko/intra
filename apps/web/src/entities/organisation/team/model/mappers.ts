import { TeamResponseDto } from './types';

export interface Team extends Omit<TeamResponseDto, 'createdAt' | 'updatedAt'> {
    createdAt: Date;
    updatedAt: Date;
}

export function mapTeamDtoToModel(dto: TeamResponseDto): Team {
    return {
        ...dto,
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
    };
}
