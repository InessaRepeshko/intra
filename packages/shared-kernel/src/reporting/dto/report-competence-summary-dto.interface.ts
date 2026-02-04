export interface ReportCompetenceSummaryDto {
    competenceId: number;
    competenceTitle?: string | null;
    averageBySelfAssessment?: number | null;
    averageByTeam?: number | null;
    averageByOther?: number | null;
    deltaByTeam?: number | null;
    deltaByOther?: number | null;
}
