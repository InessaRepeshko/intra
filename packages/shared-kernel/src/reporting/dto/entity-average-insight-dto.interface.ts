import { Decimal } from 'decimal.js';
import { EntityType } from '../enums/entity-type.enum';

export interface EntityAverageInsightsDto {
    entityId: number | null | undefined;
    entityType: EntityType;
    entityTitle: string;
    num: number;
    averageScore: Decimal | number | null;
    averageRating: Decimal | number | null;
    averageDelta: Decimal | number | null;
}
