import { InsightType } from '../../enums/insight-type.enum';

export interface StrategicReportInsightBaseDto<TDate = Date> {
    id: number;
    strategicReportId: number;
    insightType: InsightType;
    competenceId: number;
    competenceTitle: string;
    averageScore: number | null;
    averageRating: number | null;
    averageDelta: number | null;
    createdAt: TDate;
}

export type StrategicReportInsightDto = StrategicReportInsightBaseDto<Date>;

export type StrategicReportInsightResponseDto =
    StrategicReportInsightBaseDto<string>;
