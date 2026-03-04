import { PositionResponseDto } from './types';

export interface Position extends Omit<
    PositionResponseDto,
    'createdAt' | 'updatedAt'
> {
    createdAt: Date;
    updatedAt: Date;
}

export function mapPositionDtoToModel(dto: PositionResponseDto): Position {
    return {
        ...dto,
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
    };
}
