/*
  Warnings:

  - You are about to drop the column `turnout_pct_of_ratees` on the `reporting_strategic_reports` table. All the data in the column will be lost.
  - You are about to drop the column `turnout_pct_of_respondents` on the `reporting_strategic_reports` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reporting_strategic_reports" DROP COLUMN "turnout_pct_of_ratees",
DROP COLUMN "turnout_pct_of_respondents",
ADD COLUMN     "competence_ids" INTEGER[],
ADD COLUMN     "position_ids" INTEGER[],
ADD COLUMN     "question_ids" INTEGER[],
ADD COLUMN     "ratee_ids" INTEGER[],
ADD COLUMN     "respondent_ids" INTEGER[],
ADD COLUMN     "reviewer_ids" INTEGER[],
ADD COLUMN     "team_ids" INTEGER[],
ADD COLUMN     "turnout_avg_pct_of_others" DECIMAL(10,4),
ADD COLUMN     "turnout_avg_pct_of_ratees" DECIMAL(10,4),
ADD COLUMN     "turnout_avg_pct_of_teams" DECIMAL(10,4);
