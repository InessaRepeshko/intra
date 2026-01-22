/*
  Warnings:

  - You are about to drop the `feedback360_answers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `feedback360_cluster_scores` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `feedback360_cycles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `feedback360_feedbacks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `feedback360_questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `feedback360_questions_relations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `feedback360_respondents_relations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `feedback360_reviewers_relations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reporting_feedback360_reports` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "response_status" AS ENUM ('pending', 'inprogress', 'completed', 'canceled');

-- CreateEnum
CREATE TYPE "review_stage" AS ENUM ('canceled', 'verification_by_hr', 'verification_by_user', 'rejected', 'self_assessment', 'waiting_to_start', 'in_progress', 'research', 'finished');

-- DropForeignKey
ALTER TABLE "feedback360_answers" DROP CONSTRAINT "feedback360_answers_ibfk_feedback360";

-- DropForeignKey
ALTER TABLE "feedback360_answers" DROP CONSTRAINT "feedback360_answers_ibfk_feedback360_question";

-- DropForeignKey
ALTER TABLE "feedback360_answers" DROP CONSTRAINT "feedback360_answers_ibfk_question";

-- DropForeignKey
ALTER TABLE "feedback360_cluster_scores" DROP CONSTRAINT "feedback360_cluster_scores_ibfk_cluster";

-- DropForeignKey
ALTER TABLE "feedback360_cluster_scores" DROP CONSTRAINT "feedback360_cluster_scores_ibfk_cycle";

-- DropForeignKey
ALTER TABLE "feedback360_cluster_scores" DROP CONSTRAINT "feedback360_cluster_scores_ibfk_feedback360";

-- DropForeignKey
ALTER TABLE "feedback360_feedbacks" DROP CONSTRAINT "feedback360_feedbacks_ibfk_cycle";

-- DropForeignKey
ALTER TABLE "feedback360_feedbacks" DROP CONSTRAINT "feedback360_feedbacks_ibfk_position";

-- DropForeignKey
ALTER TABLE "feedback360_questions" DROP CONSTRAINT "feedback360_questions_ibfk_competence";

-- DropForeignKey
ALTER TABLE "feedback360_questions" DROP CONSTRAINT "feedback360_questions_ibfk_cycle";

-- DropForeignKey
ALTER TABLE "feedback360_questions" DROP CONSTRAINT "feedback360_questions_ibfk_position";

-- DropForeignKey
ALTER TABLE "feedback360_questions" DROP CONSTRAINT "feedback360_questions_ibfk_question";

-- DropForeignKey
ALTER TABLE "feedback360_questions_relations" DROP CONSTRAINT "feedback360_questions_relations_ibfk_feedback360";

-- DropForeignKey
ALTER TABLE "feedback360_questions_relations" DROP CONSTRAINT "feedback360_questions_relations_ibfk_question";

-- DropForeignKey
ALTER TABLE "feedback360_respondents_relations" DROP CONSTRAINT "feedback360_respondents_relations_ibfk_feedback360";

-- DropForeignKey
ALTER TABLE "feedback360_reviewers_relations" DROP CONSTRAINT "feedback360_reviewers_relations_ibfk_feedback360";

-- DropForeignKey
ALTER TABLE "library_clusters" DROP CONSTRAINT "library_clusters_ibfk_1";

-- DropForeignKey
ALTER TABLE "reporting_feedback360_reports" DROP CONSTRAINT "reporting_feedback360_reports_ibfk_cycle";

-- DropForeignKey
ALTER TABLE "reporting_feedback360_reports" DROP CONSTRAINT "reporting_feedback360_reports_ibfk_feedback360";

-- DropForeignKey
ALTER TABLE "reporting_report_analytics" DROP CONSTRAINT "reporting_report_analytics_ibfk_report";

-- DropForeignKey
ALTER TABLE "reporting_report_comments" DROP CONSTRAINT "reporting_report_comments_ibfk_report";

-- DropTable
DROP TABLE "feedback360_answers";

-- DropTable
DROP TABLE "feedback360_cluster_scores";

-- DropTable
DROP TABLE "feedback360_cycles";

-- DropTable
DROP TABLE "feedback360_feedbacks";

-- DropTable
DROP TABLE "feedback360_questions";

-- DropTable
DROP TABLE "feedback360_questions_relations";

-- DropTable
DROP TABLE "feedback360_respondents_relations";

-- DropTable
DROP TABLE "feedback360_reviewers_relations";

-- DropTable
DROP TABLE "reporting_feedback360_reports";

-- DropEnum
DROP TYPE "feedback360_stage";

-- DropEnum
DROP TYPE "feedback360_status";

-- CreateTable
CREATE TABLE "cycles" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "hr_id" INTEGER NOT NULL,
    "stage" "cycle_stage" NOT NULL DEFAULT 'new',
    "is_active" BOOLEAN DEFAULT true,
    "start_date" TIMESTAMP(0) NOT NULL,
    "review_deadline" TIMESTAMP(0),
    "approval_deadline" TIMESTAMP(0),
    "response_deadline" TIMESTAMP(0),
    "end_date" TIMESTAMP(0) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "ratee_id" INTEGER NOT NULL,
    "ratee_note" TEXT,
    "position_id" INTEGER NOT NULL,
    "hr_id" INTEGER NOT NULL,
    "hr_note" TEXT,
    "cycle_id" INTEGER,
    "report_id" INTEGER,
    "stage" "review_stage" NOT NULL DEFAULT 'verification_by_hr',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_questions" (
    "id" SERIAL NOT NULL,
    "cycle_id" INTEGER,
    "question_id" INTEGER,
    "title" TEXT NOT NULL,
    "answer_type" "answer_type" NOT NULL,
    "competence_id" INTEGER,
    "position_id" INTEGER,
    "is_for_selfassessment" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_question_relations" (
    "id" SERIAL NOT NULL,
    "review_id" INTEGER NOT NULL,
    "library_question_id" INTEGER NOT NULL,
    "question_title" TEXT NOT NULL,
    "answer_type" "answer_type" NOT NULL,
    "competence_id" INTEGER NOT NULL,
    "is_for_selfassessment" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_question_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" SERIAL NOT NULL,
    "review_id" INTEGER NOT NULL,
    "library_question_id" INTEGER NOT NULL,
    "review_question_id" INTEGER,
    "respondent_category" "respondent_category" NOT NULL,
    "answer_type" "answer_type" NOT NULL DEFAULT 'numerical_scale',
    "numerical_value" SMALLINT,
    "text_value" TEXT,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cluster_scores" (
    "id" SERIAL NOT NULL,
    "cycle_id" INTEGER,
    "cluster_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "review_id" INTEGER,
    "score" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cluster_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respondents" (
    "id" SERIAL NOT NULL,
    "review_id" INTEGER NOT NULL,
    "respondent_id" INTEGER NOT NULL,
    "respondent_category" "respondent_category" NOT NULL,
    "response_status" "response_status" NOT NULL DEFAULT 'pending',
    "respondent_note" TEXT,
    "invited_at" TIMESTAMP(0),
    "responded_at" TIMESTAMP(0),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "respondents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviewers" (
    "id" SERIAL NOT NULL,
    "review_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviewers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" SERIAL NOT NULL,
    "review_id" INTEGER NOT NULL,
    "cycle_id" INTEGER,
    "turnout_of_team" DOUBLE PRECISION,
    "turnout_of_other" DOUBLE PRECISION,
    "total_average_by_self_assessment" DOUBLE PRECISION,
    "total_average_by_team" DOUBLE PRECISION,
    "total_average_by_others" DOUBLE PRECISION,
    "total_delta_by_self_assessment" DOUBLE PRECISION,
    "total_delta_by_team" DOUBLE PRECISION,
    "total_delta_by_others" DOUBLE PRECISION,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cycles_idx_hr" ON "cycles"("hr_id");

-- CreateIndex
CREATE INDEX "cycles_idx_stage" ON "cycles"("stage");

-- CreateIndex
CREATE INDEX "reviews_idx_cycle" ON "reviews"("cycle_id");

-- CreateIndex
CREATE INDEX "reviews_idx_hr" ON "reviews"("hr_id");

-- CreateIndex
CREATE INDEX "reviews_idx_position" ON "reviews"("position_id");

-- CreateIndex
CREATE INDEX "reviews_idx_ratee" ON "reviews"("ratee_id");

-- CreateIndex
CREATE INDEX "reviews_idx_stage" ON "reviews"("stage");

-- CreateIndex
CREATE INDEX "review_questions_idx_cycle" ON "review_questions"("cycle_id");

-- CreateIndex
CREATE INDEX "review_questions_idx_question" ON "review_questions"("question_id");

-- CreateIndex
CREATE INDEX "review_questions_idx_competence" ON "review_questions"("competence_id");

-- CreateIndex
CREATE INDEX "review_questions_idx_position" ON "review_questions"("position_id");

-- CreateIndex
CREATE INDEX "review_question_relations_idx_review" ON "review_question_relations"("review_id");

-- CreateIndex
CREATE INDEX "review_question_relations_idx_question_id" ON "review_question_relations"("library_question_id");

-- CreateIndex
CREATE UNIQUE INDEX "review_question_relations_unique_review_template" ON "review_question_relations"("review_id", "library_question_id");

-- CreateIndex
CREATE INDEX "answers_idx_review" ON "answers"("review_id");

-- CreateIndex
CREATE INDEX "answers_idx_library_question" ON "answers"("library_question_id");

-- CreateIndex
CREATE INDEX "answers_idx_review_question" ON "answers"("review_question_id");

-- CreateIndex
CREATE INDEX "cluster_scores_idx_cycle" ON "cluster_scores"("cycle_id");

-- CreateIndex
CREATE INDEX "cluster_scores_idx_cluster" ON "cluster_scores"("cluster_id");

-- CreateIndex
CREATE INDEX "cluster_scores_idx_user" ON "cluster_scores"("user_id");

-- CreateIndex
CREATE INDEX "cluster_scores_idx_review" ON "cluster_scores"("review_id");

-- CreateIndex
CREATE UNIQUE INDEX "cluster_scores_unique_cluster_member" ON "cluster_scores"("cluster_id", "user_id");

-- CreateIndex
CREATE INDEX "respondents_idx_review" ON "respondents"("review_id");

-- CreateIndex
CREATE INDEX "respondents_idx_response_status" ON "respondents"("response_status");

-- CreateIndex
CREATE INDEX "respondents_idx_respondent" ON "respondents"("respondent_id");

-- CreateIndex
CREATE INDEX "respondents_idx_respondent_response_status" ON "respondents"("respondent_id", "response_status");

-- CreateIndex
CREATE UNIQUE INDEX "respondents_unique_review" ON "respondents"("respondent_id", "review_id");

-- CreateIndex
CREATE INDEX "reviewers_idx_review" ON "reviewers"("review_id");

-- CreateIndex
CREATE INDEX "reviewers_idx_user" ON "reviewers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "reviewers_unique_review_reviewer" ON "reviewers"("review_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "reports_review_id_key" ON "reports"("review_id");

-- CreateIndex
CREATE INDEX "reports_idx_cycle" ON "reports"("cycle_id");

-- AddForeignKey
ALTER TABLE "library_clusters" ADD CONSTRAINT "library_clusters_ibfk_1" FOREIGN KEY ("cycle_id") REFERENCES "cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_ibfk_cycle" FOREIGN KEY ("cycle_id") REFERENCES "cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_ibfk_position" FOREIGN KEY ("position_id") REFERENCES "org_positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review_questions" ADD CONSTRAINT "review_questions_ibfk_cycle" FOREIGN KEY ("cycle_id") REFERENCES "cycles"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review_questions" ADD CONSTRAINT "review_questions_ibfk_library_question" FOREIGN KEY ("question_id") REFERENCES "library_questions"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review_questions" ADD CONSTRAINT "review_questions_ibfk_competence" FOREIGN KEY ("competence_id") REFERENCES "library_competences"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review_questions" ADD CONSTRAINT "review_questions_ibfk_position" FOREIGN KEY ("position_id") REFERENCES "org_positions"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review_question_relations" ADD CONSTRAINT "review_question_relations_ibfk_review" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review_question_relations" ADD CONSTRAINT "review_question_relations_ibfk_library_question" FOREIGN KEY ("library_question_id") REFERENCES "library_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_ibfk_library_library_question" FOREIGN KEY ("library_question_id") REFERENCES "library_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_ibfk_review_question" FOREIGN KEY ("review_question_id") REFERENCES "review_questions"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_ibfk_review" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cluster_scores" ADD CONSTRAINT "cluster_scores_ibfk_cycle" FOREIGN KEY ("cycle_id") REFERENCES "cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cluster_scores" ADD CONSTRAINT "cluster_scores_ibfk_cluster" FOREIGN KEY ("cluster_id") REFERENCES "library_clusters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cluster_scores" ADD CONSTRAINT "cluster_scores_ibfk_review" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "respondents" ADD CONSTRAINT "respondents_ibfk_review" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviewers" ADD CONSTRAINT "reviewers_ibfk_review" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporting_report_analytics" ADD CONSTRAINT "reporting_report_analytics_ibfk_report" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporting_report_comments" ADD CONSTRAINT "reporting_report_comments_ibfk_report" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
