export interface ReportQuestionSummaryDto {
    questionId: number;
    questionTitle?: string | null;
    competenceId?: number | null;
    competenceTitle?: string | null;
    averageBySelfAssessment?: number | null;
    averageByTeam?: number | null;
    averageByOther?: number | null;
    deltaByTeam?: number | null;
    deltaByOther?: number | null;
}
