/*
  Warnings:

  - You are about to alter the column `employees_count` on the `feedback360_cluster_score_analytics` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,4)`.

*/
-- AlterTable
ALTER TABLE "feedback360_cluster_score_analytics" ADD COLUMN     "employees_density" DECIMAL(10,4),
ALTER COLUMN "employees_count" SET DEFAULT 0,
ALTER COLUMN "employees_count" SET DATA TYPE DECIMAL(10,4);

-- CreateTable
CREATE TABLE "reporting_strategic_reports" (
    "id" SERIAL NOT NULL,
    "cycle_id" INTEGER,
    "ratee_count" INTEGER NOT NULL,
    "respondent_count" INTEGER NOT NULL,
    "answer_count" INTEGER NOT NULL,
    "reviewer_count" INTEGER NOT NULL,
    "team_count" INTEGER NOT NULL,
    "position_count" INTEGER NOT NULL,
    "competence_count" INTEGER NOT NULL,
    "question_count" INTEGER NOT NULL,
    "turnout_pct_of_ratees" DECIMAL(10,4),
    "turnout_pct_of_respondents" DECIMAL(10,4),
    "competence_general_avg_self" DECIMAL(10,4),
    "competence_general_avg_team" DECIMAL(10,4),
    "competence_general_avg_other" DECIMAL(10,4),
    "competence_general_pct_self" DECIMAL(10,4),
    "competence_general_pct_team" DECIMAL(10,4),
    "competence_general_pct_other" DECIMAL(10,4),
    "competence_general_delta_team" DECIMAL(10,4),
    "competence_general_delta_other" DECIMAL(10,4),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reporting_strategic_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reporting_strategic_report_analytics" (
    "id" SERIAL NOT NULL,
    "strategic_report_id" INTEGER NOT NULL,
    "competence_id" INTEGER NOT NULL,
    "competence_title" TEXT NOT NULL,
    "average_by_self_assessment" DECIMAL(10,4),
    "average_by_team" DECIMAL(10,4),
    "average_by_other" DECIMAL(10,4),
    "percentage_by_self_assessment" DECIMAL(10,4),
    "percentage_by_team" DECIMAL(10,4),
    "percentage_by_other" DECIMAL(10,4),
    "delta_percentage_by_team" DECIMAL(10,4),
    "delta_percentage_by_other" DECIMAL(10,4),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reporting_strategic_report_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reporting_strategic_reports_cycle_id_idx" ON "reporting_strategic_reports"("cycle_id");

-- CreateIndex
CREATE INDEX "reporting_strategic_report_analytics_strategic_report_id_idx" ON "reporting_strategic_report_analytics"("strategic_report_id");

-- CreateIndex
CREATE INDEX "reporting_strategic_report_analytics_competence_id_idx" ON "reporting_strategic_report_analytics"("competence_id");

-- AddForeignKey
ALTER TABLE "reporting_strategic_reports" ADD CONSTRAINT "reporting_strategic_reports_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "feedback360_cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporting_strategic_report_analytics" ADD CONSTRAINT "reporting_strategic_report_analytics_strategic_report_id_fkey" FOREIGN KEY ("strategic_report_id") REFERENCES "reporting_strategic_reports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporting_strategic_report_analytics" ADD CONSTRAINT "reporting_strategic_report_analytics_competence_id_fkey" FOREIGN KEY ("competence_id") REFERENCES "library_competences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
