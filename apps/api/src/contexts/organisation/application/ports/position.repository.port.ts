import {
    PositionSearchQuery,
    UpdatePositionPayload,
} from '@intra/shared-kernel';
import { PositionDomain } from '../../domain/position.domain';

export const ORGANISATION_POSITION_REPOSITORY = Symbol(
    'ORGANISATION.POSITION_REPOSITORY',
);

export interface PositionRepositoryPort {
    create(position: PositionDomain): Promise<PositionDomain>;
    findById(id: number): Promise<PositionDomain | null>;
    search(query: PositionSearchQuery): Promise<PositionDomain[]>;
    updateById(
        id: number,
        patch: UpdatePositionPayload,
    ): Promise<PositionDomain>;
    deleteById(id: number): Promise<void>;
}
