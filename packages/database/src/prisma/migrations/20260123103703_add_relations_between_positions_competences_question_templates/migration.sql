/*
  Warnings:

  - You are about to drop the `library_question_template_position_relations` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `review_id` on table `feedback360_clusters_scores` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "library_question_template_position_relations" DROP CONSTRAINT "library_question_template_position_relations_position_id_fkey";

-- DropForeignKey
ALTER TABLE "library_question_template_position_relations" DROP CONSTRAINT "library_question_template_position_relations_question_temp_fkey";

-- AlterTable
ALTER TABLE "feedback360_clusters_scores" ALTER COLUMN "review_id" SET NOT NULL;

-- DropTable
DROP TABLE "library_question_template_position_relations";

-- CreateTable
CREATE TABLE "library_position_question_template_relations" (
    "id" SERIAL NOT NULL,
    "position_id" INTEGER NOT NULL,
    "question_template_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "library_position_question_template_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_position_competence_relations" (
    "id" SERIAL NOT NULL,
    "position_id" INTEGER NOT NULL,
    "competence_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "library_position_competence_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_competence_question_template_relations" (
    "id" SERIAL NOT NULL,
    "competence_id" INTEGER NOT NULL,
    "question_template_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "library_competence_question_template_relations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "library_position_question_template_relations_position_id_idx" ON "library_position_question_template_relations"("position_id");

-- CreateIndex
CREATE UNIQUE INDEX "library_position_question_template_relations_question_templ_key" ON "library_position_question_template_relations"("question_template_id", "position_id");

-- CreateIndex
CREATE UNIQUE INDEX "library_position_competence_relations_position_id_competenc_key" ON "library_position_competence_relations"("position_id", "competence_id");

-- CreateIndex
CREATE UNIQUE INDEX "library_competence_question_template_relations_competence_i_key" ON "library_competence_question_template_relations"("competence_id", "question_template_id");

-- AddForeignKey
ALTER TABLE "library_position_question_template_relations" ADD CONSTRAINT "library_position_question_template_relations_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "org_positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_position_question_template_relations" ADD CONSTRAINT "library_position_question_template_relations_question_temp_fkey" FOREIGN KEY ("question_template_id") REFERENCES "library_question_templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_position_competence_relations" ADD CONSTRAINT "library_position_competence_relations_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "org_positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_position_competence_relations" ADD CONSTRAINT "library_position_competence_relations_competence_id_fkey" FOREIGN KEY ("competence_id") REFERENCES "library_competences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_competence_question_template_relations" ADD CONSTRAINT "library_competence_question_template_relations_competence__fkey" FOREIGN KEY ("competence_id") REFERENCES "library_competences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_competence_question_template_relations" ADD CONSTRAINT "library_competence_question_template_relations_question_te_fkey" FOREIGN KEY ("question_template_id") REFERENCES "library_question_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
