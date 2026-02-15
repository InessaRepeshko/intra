-- AlterTable
ALTER TABLE "reporting_reports" ADD COLUMN     "total_average_competence_by_others" DOUBLE PRECISION,
ADD COLUMN     "total_average_competence_by_self_assessment" DOUBLE PRECISION,
ADD COLUMN     "total_average_competence_by_team" DOUBLE PRECISION,
ADD COLUMN     "total_competence_percentage_by_others" DOUBLE PRECISION,
ADD COLUMN     "total_competence_percentage_by_self_assessment" DOUBLE PRECISION,
ADD COLUMN     "total_competence_percentage_by_team" DOUBLE PRECISION;
