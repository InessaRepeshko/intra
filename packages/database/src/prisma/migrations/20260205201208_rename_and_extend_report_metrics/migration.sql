/*
  Warnings:

  - You are about to drop the column `delta_by_other` on the `reporting_analytics` table. All the data in the column will be lost.
  - You are about to drop the column `delta_by_team` on the `reporting_analytics` table. All the data in the column will be lost.
  - You are about to drop the column `total_average_by_others` on the `reporting_reports` table. All the data in the column will be lost.
  - You are about to drop the column `total_average_by_self_assessment` on the `reporting_reports` table. All the data in the column will be lost.
  - You are about to drop the column `total_average_by_team` on the `reporting_reports` table. All the data in the column will be lost.
  - You are about to drop the column `total_average_competence_by_others` on the `reporting_reports` table. All the data in the column will be lost.
  - You are about to drop the column `total_average_competence_by_self_assessment` on the `reporting_reports` table. All the data in the column will be lost.
  - You are about to drop the column `total_average_competence_by_team` on the `reporting_reports` table. All the data in the column will be lost.
  - You are about to drop the column `total_competence_percentage_by_others` on the `reporting_reports` table. All the data in the column will be lost.
  - You are about to drop the column `total_competence_percentage_by_self_assessment` on the `reporting_reports` table. All the data in the column will be lost.
  - You are about to drop the column `total_competence_percentage_by_team` on the `reporting_reports` table. All the data in the column will be lost.
  - You are about to drop the column `total_delta_by_others` on the `reporting_reports` table. All the data in the column will be lost.
  - You are about to drop the column `total_delta_by_team` on the `reporting_reports` table. All the data in the column will be lost.
  - You are about to drop the column `turnout_of_other` on the `reporting_reports` table. All the data in the column will be lost.
  - You are about to drop the column `turnout_of_team` on the `reporting_reports` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reporting_analytics" DROP COLUMN "delta_by_other",
DROP COLUMN "delta_by_team",
ADD COLUMN     "delta_percentage_by_other" DECIMAL(10,4),
ADD COLUMN     "delta_percentage_by_team" DECIMAL(10,4),
ADD COLUMN     "percentage_by_other" DECIMAL(10,4),
ADD COLUMN     "percentage_by_self_assessment" DECIMAL(10,4),
ADD COLUMN     "percentage_by_team" DECIMAL(10,4);

-- AlterTable
ALTER TABLE "reporting_reports" DROP COLUMN "total_average_by_others",
DROP COLUMN "total_average_by_self_assessment",
DROP COLUMN "total_average_by_team",
DROP COLUMN "total_average_competence_by_others",
DROP COLUMN "total_average_competence_by_self_assessment",
DROP COLUMN "total_average_competence_by_team",
DROP COLUMN "total_competence_percentage_by_others",
DROP COLUMN "total_competence_percentage_by_self_assessment",
DROP COLUMN "total_competence_percentage_by_team",
DROP COLUMN "total_delta_by_others",
DROP COLUMN "total_delta_by_team",
DROP COLUMN "turnout_of_other",
DROP COLUMN "turnout_of_team",
ADD COLUMN     "competence_tot_avg_by_others" DECIMAL(10,4),
ADD COLUMN     "competence_tot_avg_by_self" DECIMAL(10,4),
ADD COLUMN     "competence_tot_avg_by_team" DECIMAL(10,4),
ADD COLUMN     "competence_tot_delta_pct_by_others" DECIMAL(10,4),
ADD COLUMN     "competence_tot_delta_pct_by_team" DECIMAL(10,4),
ADD COLUMN     "competence_tot_pct_by_others" DECIMAL(10,4),
ADD COLUMN     "competence_tot_pct_by_self" DECIMAL(10,4),
ADD COLUMN     "competence_tot_pct_by_team" DECIMAL(10,4),
ADD COLUMN     "question_tot_avg_by_others" DECIMAL(10,4),
ADD COLUMN     "question_tot_avg_by_self" DECIMAL(10,4),
ADD COLUMN     "question_tot_avg_by_team" DECIMAL(10,4),
ADD COLUMN     "question_tot_delta_pct_by_others" DECIMAL(10,4),
ADD COLUMN     "question_tot_delta_pct_by_team" DECIMAL(10,4),
ADD COLUMN     "question_tot_pct_by_others" DECIMAL(10,4),
ADD COLUMN     "question_tot_pct_by_self" DECIMAL(10,4),
ADD COLUMN     "question_tot_pct_by_team" DECIMAL(10,4),
ADD COLUMN     "turnout_pct_of_other" DECIMAL(10,4),
ADD COLUMN     "turnout_pct_of_team" DECIMAL(10,4);
