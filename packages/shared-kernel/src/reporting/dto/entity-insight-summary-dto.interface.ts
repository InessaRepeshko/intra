import { EntityAverageInsightsDto } from './entity-average-insight-dto.interface';

export interface EntityInsightSummaryDto {
    highestRating?: EntityAverageInsightsDto;
    lowestRating?: EntityAverageInsightsDto;
    highestDelta?: EntityAverageInsightsDto;
    lowestDelta?: EntityAverageInsightsDto;
}
