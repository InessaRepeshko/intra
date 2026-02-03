/*
  Warnings:

  - You are about to drop the column `respondent_category` on the `feedback360_respondents` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `feedback360_reviewers` table. All the data in the column will be lost.
  - You are about to drop the column `position_id` on the `feedback360_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `position_title` on the `feedback360_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `ratee_note` on the `feedback360_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `org_team_memberships` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[review_id,reviewer_id]` on the table `feedback360_reviewers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[team_id,member_id,is_primary]` on the table `org_team_memberships` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `feedback360_respondents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position_id` to the `feedback360_respondents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position_title` to the `feedback360_respondents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `competence_title` to the `feedback360_review_question_relations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position_id` to the `feedback360_reviewers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position_title` to the `feedback360_reviewers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewer_id` to the `feedback360_reviewers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratee_position_id` to the `feedback360_reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratee_position_title` to the `feedback360_reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `member_id` to the `org_team_memberships` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "feedback360_reviewers" DROP CONSTRAINT "feedback360_reviewers_user_id_fkey";

-- DropForeignKey
ALTER TABLE "feedback360_reviews" DROP CONSTRAINT "feedback360_reviews_position_id_fkey";

-- DropForeignKey
ALTER TABLE "org_team_memberships" DROP CONSTRAINT "org_team_memberships_user_id_fkey";

-- DropIndex
DROP INDEX "feedback360_reviewers_review_id_user_id_key";

-- DropIndex
DROP INDEX "feedback360_reviewers_user_id_idx";

-- DropIndex
DROP INDEX "feedback360_reviews_position_id_idx";

-- DropIndex
DROP INDEX "org_team_memberships_team_id_user_id_is_primary_key";

-- DropIndex
DROP INDEX "org_team_memberships_user_id_idx";

-- AlterTable
ALTER TABLE "feedback360_respondents" DROP COLUMN "respondent_category",
ADD COLUMN     "canceled_at" TIMESTAMP(0),
ADD COLUMN     "category" "feedback360_respondent_category" NOT NULL,
ADD COLUMN     "hr_note" TEXT,
ADD COLUMN     "position_id" INTEGER NOT NULL,
ADD COLUMN     "position_title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "feedback360_review_question_relations" ADD COLUMN     "competence_title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "feedback360_reviewers" DROP COLUMN "user_id",
ADD COLUMN     "position_id" INTEGER NOT NULL,
ADD COLUMN     "position_title" TEXT NOT NULL,
ADD COLUMN     "reviewer_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "feedback360_reviews" DROP COLUMN "position_id",
DROP COLUMN "position_title",
DROP COLUMN "ratee_note",
ADD COLUMN     "manager_id" INTEGER,
ADD COLUMN     "ratee_position_id" INTEGER NOT NULL,
ADD COLUMN     "ratee_position_title" TEXT NOT NULL,
ADD COLUMN     "team_id" INTEGER,
ADD COLUMN     "team_title" TEXT;

-- AlterTable
ALTER TABLE "org_team_memberships" DROP COLUMN "user_id",
ADD COLUMN     "member_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "feedback360_respondents_position_id_idx" ON "feedback360_respondents"("position_id");

-- CreateIndex
CREATE INDEX "feedback360_reviewers_reviewer_id_idx" ON "feedback360_reviewers"("reviewer_id");

-- CreateIndex
CREATE UNIQUE INDEX "feedback360_reviewers_review_id_reviewer_id_key" ON "feedback360_reviewers"("review_id", "reviewer_id");

-- CreateIndex
CREATE INDEX "feedback360_reviews_ratee_position_id_idx" ON "feedback360_reviews"("ratee_position_id");

-- CreateIndex
CREATE INDEX "feedback360_reviews_team_id_idx" ON "feedback360_reviews"("team_id");

-- CreateIndex
CREATE INDEX "feedback360_reviews_manager_id_idx" ON "feedback360_reviews"("manager_id");

-- CreateIndex
CREATE INDEX "org_team_memberships_member_id_idx" ON "org_team_memberships"("member_id");

-- CreateIndex
CREATE UNIQUE INDEX "org_team_memberships_team_id_member_id_is_primary_key" ON "org_team_memberships"("team_id", "member_id", "is_primary");

-- AddForeignKey
ALTER TABLE "org_team_memberships" ADD CONSTRAINT "org_team_memberships_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "identity_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_reviews" ADD CONSTRAINT "feedback360_reviews_ratee_position_id_fkey" FOREIGN KEY ("ratee_position_id") REFERENCES "org_positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_reviews" ADD CONSTRAINT "feedback360_reviews_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "org_teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_reviews" ADD CONSTRAINT "feedback360_reviews_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "identity_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_respondents" ADD CONSTRAINT "feedback360_respondents_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "org_positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_reviewers" ADD CONSTRAINT "feedback360_reviewers_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "identity_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
