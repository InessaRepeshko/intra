import { CompetenceResponseDto } from './types';

export interface Competence extends Omit<
    CompetenceResponseDto,
    'createdAt' | 'updatedAt'
> {
    createdAt: Date;
    updatedAt: Date;
}

export function mapCompetenceDtoToModel(
    dto: CompetenceResponseDto,
): Competence {
    return {
        ...dto,
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
    };
}
