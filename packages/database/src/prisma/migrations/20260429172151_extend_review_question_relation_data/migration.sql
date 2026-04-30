/*
  Warnings:

  - You are about to alter the column `competence_title` on the `feedback360_review_question_relations` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "feedback360_review_question_relations" ADD COLUMN     "competence_code" VARCHAR(100),
ADD COLUMN     "competence_description" TEXT,
ALTER COLUMN "competence_title" SET DATA TYPE VARCHAR(255);
