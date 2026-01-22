/*
  Warnings:

  - You are about to drop the column `library_question_id` on the `feedback360_answers` table. All the data in the column will be lost.
  - You are about to drop the column `library_question_id` on the `feedback360_questions` table. All the data in the column will be lost.
  - You are about to drop the column `position_id` on the `feedback360_questions` table. All the data in the column will be lost.
  - You are about to drop the column `library_question_id` on the `feedback360_review_question_relations` table. All the data in the column will be lost.
  - You are about to drop the `library_question_positions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `library_questions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[review_id,question_id]` on the table `feedback360_review_question_relations` will be added. If there are existing duplicate values, this will fail.
  - Made the column `review_question_id` on table `feedback360_answers` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `question_id` to the `feedback360_review_question_relations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position_title` to the `feedback360_reviews` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "question_template_status" AS ENUM ('archive', 'active');

-- DropForeignKey
ALTER TABLE "feedback360_answers" DROP CONSTRAINT "feedback360_answers_library_question_id_fkey";

-- DropForeignKey
ALTER TABLE "feedback360_questions" DROP CONSTRAINT "feedback360_questions_library_question_id_fkey";

-- DropForeignKey
ALTER TABLE "feedback360_questions" DROP CONSTRAINT "feedback360_questions_position_id_fkey";

-- DropForeignKey
ALTER TABLE "feedback360_review_question_relations" DROP CONSTRAINT "feedback360_review_question_relations_library_question_id_fkey";

-- DropForeignKey
ALTER TABLE "library_question_positions" DROP CONSTRAINT "library_question_positions_position_id_fkey";

-- DropForeignKey
ALTER TABLE "library_question_positions" DROP CONSTRAINT "library_question_positions_question_id_fkey";

-- DropForeignKey
ALTER TABLE "library_questions" DROP CONSTRAINT "library_questions_competence_id_fkey";

-- DropIndex
DROP INDEX "feedback360_answers_library_question_id_idx";

-- DropIndex
DROP INDEX "feedback360_questions_library_question_id_idx";

-- DropIndex
DROP INDEX "feedback360_questions_position_id_idx";

-- DropIndex
DROP INDEX "feedback360_review_question_relations_library_question_id_idx";

-- DropIndex
DROP INDEX "feedback360_review_question_relations_review_id_library_que_key";

-- AlterTable
ALTER TABLE "feedback360_answers" DROP COLUMN "library_question_id",
ALTER COLUMN "review_question_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "feedback360_questions" DROP COLUMN "library_question_id",
DROP COLUMN "position_id",
ADD COLUMN     "question_template_id" INTEGER;

-- AlterTable
ALTER TABLE "feedback360_review_question_relations" DROP COLUMN "library_question_id",
ADD COLUMN     "question_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "feedback360_reviews" ADD COLUMN     "position_title" TEXT NOT NULL;

-- DropTable
DROP TABLE "library_question_positions";

-- DropTable
DROP TABLE "library_questions";

-- DropEnum
DROP TYPE "library_question_status";

-- CreateTable
CREATE TABLE "library_question_templates" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "answer_type" "library_answer_type" NOT NULL,
    "competence_id" INTEGER NOT NULL,
    "is_for_selfassessment" BOOLEAN DEFAULT false,
    "status" "question_template_status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "library_question_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_question_template_position_relations" (
    "id" SERIAL NOT NULL,
    "question_template_id" INTEGER NOT NULL,
    "position_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "library_question_template_position_relations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "library_question_templates_competence_id_idx" ON "library_question_templates"("competence_id");

-- CreateIndex
CREATE INDEX "library_question_template_position_relations_position_id_idx" ON "library_question_template_position_relations"("position_id");

-- CreateIndex
CREATE UNIQUE INDEX "library_question_template_position_relations_question_templ_key" ON "library_question_template_position_relations"("question_template_id", "position_id");

-- CreateIndex
CREATE INDEX "feedback360_questions_question_template_id_idx" ON "feedback360_questions"("question_template_id");

-- CreateIndex
CREATE INDEX "feedback360_review_question_relations_question_id_idx" ON "feedback360_review_question_relations"("question_id");

-- CreateIndex
CREATE INDEX "feedback360_review_question_relations_competence_id_idx" ON "feedback360_review_question_relations"("competence_id");

-- CreateIndex
CREATE UNIQUE INDEX "feedback360_review_question_relations_review_id_question_id_key" ON "feedback360_review_question_relations"("review_id", "question_id");

-- AddForeignKey
ALTER TABLE "library_question_templates" ADD CONSTRAINT "library_question_templates_competence_id_fkey" FOREIGN KEY ("competence_id") REFERENCES "library_competences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_question_template_position_relations" ADD CONSTRAINT "library_question_template_position_relations_question_temp_fkey" FOREIGN KEY ("question_template_id") REFERENCES "library_question_templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_question_template_position_relations" ADD CONSTRAINT "library_question_template_position_relations_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "org_positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_questions" ADD CONSTRAINT "feedback360_questions_question_template_id_fkey" FOREIGN KEY ("question_template_id") REFERENCES "library_question_templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_review_question_relations" ADD CONSTRAINT "feedback360_review_question_relations_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "feedback360_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_review_question_relations" ADD CONSTRAINT "feedback360_review_question_relations_competence_id_fkey" FOREIGN KEY ("competence_id") REFERENCES "library_competences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
