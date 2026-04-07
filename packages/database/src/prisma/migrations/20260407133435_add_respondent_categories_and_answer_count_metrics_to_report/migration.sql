/*
  Warnings:

  - Added the required column `answer_count` to the `reporting_reports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reporting_reports" ADD COLUMN     "answer_count" INTEGER NOT NULL,
ADD COLUMN     "respondent_categories" "feedback360_respondent_category"[];
