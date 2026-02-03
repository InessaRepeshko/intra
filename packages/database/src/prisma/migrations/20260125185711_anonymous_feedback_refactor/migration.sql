/*
  Warnings:

  - You are about to drop the column `respondent_id` on the `feedback360_answers` table. All the data in the column will be lost.
  - You are about to drop the column `evaluators_count` on the `feedback360_clusters_scores` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "feedback360_answers" DROP CONSTRAINT "feedback360_answers_respondent_id_fkey";

-- DropIndex
DROP INDEX "feedback360_answers_respondent_id_idx";

-- AlterTable
ALTER TABLE "feedback360_answers" DROP COLUMN "respondent_id",
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "feedback360_clusters_scores" DROP COLUMN "evaluators_count",
ADD COLUMN     "answers_count" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "feedback360_answers" ADD CONSTRAINT "feedback360_answers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
