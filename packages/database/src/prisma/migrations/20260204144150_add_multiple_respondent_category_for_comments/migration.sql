/*
  Warnings:

  - You are about to drop the column `respondent_category` on the `reporting_comments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reporting_comments" DROP COLUMN "respondent_category",
ADD COLUMN     "respondent_categories" "feedback360_respondent_category"[];
