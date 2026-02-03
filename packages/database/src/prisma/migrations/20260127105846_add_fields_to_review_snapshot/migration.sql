/*
  Warnings:

  - Added the required column `full_name` to the `feedback360_respondents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `full_name` to the `feedback360_reviewers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hr_full_name` to the `feedback360_reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratee_full_name` to the `feedback360_reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "feedback360_respondents" ADD COLUMN     "full_name" VARCHAR(302) NOT NULL,
ADD COLUMN     "team_id" INTEGER,
ADD COLUMN     "team_title" TEXT;

-- AlterTable
ALTER TABLE "feedback360_reviewers" ADD COLUMN     "full_name" VARCHAR(302) NOT NULL,
ADD COLUMN     "team_id" INTEGER,
ADD COLUMN     "team_title" TEXT;

-- AlterTable
ALTER TABLE "feedback360_reviews" ADD COLUMN     "hr_full_name" VARCHAR(302) NOT NULL,
ADD COLUMN     "manager_full_name" VARCHAR(302),
ADD COLUMN     "manager_position_id" INTEGER,
ADD COLUMN     "manager_position_title" TEXT,
ADD COLUMN     "ratee_full_name" VARCHAR(302) NOT NULL;

-- CreateIndex
CREATE INDEX "feedback360_respondents_team_id_idx" ON "feedback360_respondents"("team_id");

-- CreateIndex
CREATE INDEX "feedback360_reviewers_team_id_idx" ON "feedback360_reviewers"("team_id");

-- AddForeignKey
ALTER TABLE "feedback360_respondents" ADD CONSTRAINT "feedback360_respondents_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "org_teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_reviewers" ADD CONSTRAINT "feedback360_reviewers_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "org_teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
