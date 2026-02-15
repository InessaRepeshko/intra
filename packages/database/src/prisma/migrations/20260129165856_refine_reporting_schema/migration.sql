/*
  Warnings:

  - You are about to drop the column `dimension` on the `reporting_analytics` table. All the data in the column will be lost.
  - You are about to drop the column `entity_id` on the `reporting_analytics` table. All the data in the column will be lost.
  - You are about to drop the column `entity_title` on the `reporting_analytics` table. All the data in the column will be lost.
  - Added the required column `question_id` to the `reporting_comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question_title` to the `reporting_comments` table without a default value. This is not possible if the table is not empty.
  - Made the column `comment` on table `reporting_comments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `number_of_mentions` on table `reporting_comments` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `respondent_count` to the `reporting_reports` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "reporting_analytics_report_id_entity_type_entity_id_key";

-- AlterTable
ALTER TABLE "reporting_analytics" DROP COLUMN "dimension",
DROP COLUMN "entity_id",
DROP COLUMN "entity_title",
ADD COLUMN     "competence_id" INTEGER,
ADD COLUMN     "competence_title" TEXT,
ADD COLUMN     "question_id" INTEGER,
ADD COLUMN     "question_title" TEXT;

-- AlterTable
ALTER TABLE "reporting_comments" ADD COLUMN     "question_id" INTEGER NOT NULL,
ADD COLUMN     "question_title" TEXT NOT NULL,
ALTER COLUMN "comment" SET NOT NULL,
ALTER COLUMN "comment_sentiment" DROP NOT NULL,
ALTER COLUMN "number_of_mentions" SET NOT NULL;

-- AlterTable
ALTER TABLE "reporting_reports" ADD COLUMN     "respondent_count" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "reporting_analytics_question_id_idx" ON "reporting_analytics"("question_id");

-- CreateIndex
CREATE INDEX "reporting_analytics_competence_id_idx" ON "reporting_analytics"("competence_id");

-- CreateIndex
CREATE INDEX "reporting_comments_question_id_idx" ON "reporting_comments"("question_id");

-- AddForeignKey
ALTER TABLE "reporting_analytics" ADD CONSTRAINT "reporting_analytics_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "feedback360_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporting_analytics" ADD CONSTRAINT "reporting_analytics_competence_id_fkey" FOREIGN KEY ("competence_id") REFERENCES "library_competences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporting_comments" ADD CONSTRAINT "reporting_comments_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "feedback360_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
