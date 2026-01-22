/*
  Warnings:

  - The `answer_type` column on the `feedback360_answers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `competence_clusters` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `competence_competences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `competence_question_positions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `competence_questions` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `answer_type` on the `feedback360_questions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `answer_type` on the `feedback360_questions_relations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "answer_type" AS ENUM ('numerical_scale', 'text_field');

-- CreateEnum
CREATE TYPE "question_status" AS ENUM ('archive', 'active');

-- DropForeignKey
ALTER TABLE "competence_clusters" DROP CONSTRAINT "competence_clusters_ibfk_1";

-- DropForeignKey
ALTER TABLE "competence_clusters" DROP CONSTRAINT "competence_clusters_ibfk_2";

-- DropForeignKey
ALTER TABLE "competence_question_positions" DROP CONSTRAINT "competence_question_positions_ibfk_1";

-- DropForeignKey
ALTER TABLE "competence_question_positions" DROP CONSTRAINT "competence_question_positions_ibfk_2";

-- DropForeignKey
ALTER TABLE "competence_questions" DROP CONSTRAINT "competence_questions_ibfk_1";

-- DropForeignKey
ALTER TABLE "feedback360_answers" DROP CONSTRAINT "feedback360_answers_ibfk_question";

-- DropForeignKey
ALTER TABLE "feedback360_cluster_scores" DROP CONSTRAINT "feedback360_cluster_scores_ibfk_cluster";

-- DropForeignKey
ALTER TABLE "feedback360_questions" DROP CONSTRAINT "feedback360_questions_ibfk_competence";

-- DropForeignKey
ALTER TABLE "feedback360_questions" DROP CONSTRAINT "feedback360_questions_ibfk_question";

-- DropForeignKey
ALTER TABLE "feedback360_questions_relations" DROP CONSTRAINT "feedback360_questions_relations_ibfk_question";

-- AlterTable
ALTER TABLE "feedback360_answers" DROP COLUMN "answer_type",
ADD COLUMN     "answer_type" "answer_type" NOT NULL DEFAULT 'numerical_scale';

-- AlterTable
ALTER TABLE "feedback360_questions" DROP COLUMN "answer_type",
ADD COLUMN     "answer_type" "answer_type" NOT NULL;

-- AlterTable
ALTER TABLE "feedback360_questions_relations" DROP COLUMN "answer_type",
ADD COLUMN     "answer_type" "answer_type" NOT NULL;

-- DropTable
DROP TABLE "competence_clusters";

-- DropTable
DROP TABLE "competence_competences";

-- DropTable
DROP TABLE "competence_question_positions";

-- DropTable
DROP TABLE "competence_questions";

-- DropEnum
DROP TYPE "competence_question_status";

-- DropEnum
DROP TYPE "competence_questions_answer_type";

-- CreateTable
CREATE TABLE "library_competences" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(100),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "library_competences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_clusters" (
    "id" SERIAL NOT NULL,
    "cycle_id" INTEGER,
    "competence_id" INTEGER NOT NULL,
    "lower_bound" DOUBLE PRECISION NOT NULL,
    "upper_bound" DOUBLE PRECISION NOT NULL,
    "min_score" DOUBLE PRECISION NOT NULL,
    "max_score" DOUBLE PRECISION NOT NULL,
    "average_score" DOUBLE PRECISION NOT NULL,
    "employees_count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "library_clusters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_questions" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "answer_type" "answer_type" NOT NULL,
    "competence_id" INTEGER NOT NULL,
    "is_for_selfassessment" BOOLEAN DEFAULT false,
    "question_status" "question_status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "library_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_question_position" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "position_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "library_question_position_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "library_unique_competence_code" ON "library_competences"("code");

-- CreateIndex
CREATE UNIQUE INDEX "library_unique_competence_title" ON "library_competences"("title");

-- CreateIndex
CREATE INDEX "cluster_idx_competence" ON "library_clusters"("competence_id");

-- CreateIndex
CREATE INDEX "cluster_idx_cycle" ON "library_clusters"("cycle_id");

-- CreateIndex
CREATE UNIQUE INDEX "library_unique_competence_cluster" ON "library_clusters"("cycle_id", "competence_id", "lower_bound", "upper_bound");

-- CreateIndex
CREATE INDEX "question_idx_competence" ON "library_questions"("competence_id");

-- CreateIndex
CREATE INDEX "question_position_position_id" ON "library_question_position"("position_id");

-- CreateIndex
CREATE UNIQUE INDEX "question_position_unique_relation" ON "library_question_position"("question_id", "position_id");

-- AddForeignKey
ALTER TABLE "library_clusters" ADD CONSTRAINT "library_clusters_ibfk_1" FOREIGN KEY ("cycle_id") REFERENCES "feedback360_cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_clusters" ADD CONSTRAINT "library_clusters_ibfk_2" FOREIGN KEY ("competence_id") REFERENCES "library_competences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_questions" ADD CONSTRAINT "library_questions_ibfk_1" FOREIGN KEY ("competence_id") REFERENCES "library_competences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_question_position" ADD CONSTRAINT "library_question_position_ibfk_1" FOREIGN KEY ("question_id") REFERENCES "library_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_question_position" ADD CONSTRAINT "library_question_position_ibfk_2" FOREIGN KEY ("position_id") REFERENCES "org_positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_questions" ADD CONSTRAINT "feedback360_questions_ibfk_question" FOREIGN KEY ("question_id") REFERENCES "library_questions"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_questions" ADD CONSTRAINT "feedback360_questions_ibfk_competence" FOREIGN KEY ("competence_id") REFERENCES "library_competences"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_questions_relations" ADD CONSTRAINT "feedback360_questions_relations_ibfk_question" FOREIGN KEY ("question_id") REFERENCES "library_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_answers" ADD CONSTRAINT "feedback360_answers_ibfk_question" FOREIGN KEY ("question_id") REFERENCES "library_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_cluster_scores" ADD CONSTRAINT "feedback360_cluster_scores_ibfk_cluster" FOREIGN KEY ("cluster_id") REFERENCES "library_clusters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
