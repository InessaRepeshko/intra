/*
  Warnings:

  - The `status` column on the `identity_users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `question_status` column on the `library_questions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `answers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cluster_scores` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cycles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `identity_user_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `library_question_position` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `org_positions_hierarchy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reporting_report_analytics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reporting_report_comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `respondents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `review_question_relations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `review_questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reviewers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `answer_type` on the `library_questions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "identity_status" AS ENUM ('inactive', 'active');

-- CreateEnum
CREATE TYPE "library_answer_type" AS ENUM ('numerical_scale', 'text_field');

-- CreateEnum
CREATE TYPE "library_question_status" AS ENUM ('archive', 'active');

-- CreateEnum
CREATE TYPE "feedback360_cycle_stage" AS ENUM ('canceled', 'new', 'active', 'finished', 'archived');

-- CreateEnum
CREATE TYPE "feedback360_response_status" AS ENUM ('pending', 'in_progress', 'completed', 'canceled');

-- CreateEnum
CREATE TYPE "feedback360_review_stage" AS ENUM ('canceled', 'verification_by_hr', 'verification_by_user', 'rejected', 'self_assessment', 'waiting_to_start', 'in_progress', 'research', 'finished');

-- CreateEnum
CREATE TYPE "feedback360_respondent_category" AS ENUM ('self_assessment', 'team', 'other');

-- CreateEnum
CREATE TYPE "reporting_entity_type" AS ENUM ('question', 'competence');

-- CreateEnum
CREATE TYPE "reporting_comment_sentiment" AS ENUM ('negative', 'positive');

-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_ibfk_library_library_question";

-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_ibfk_review";

-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_ibfk_review_question";

-- DropForeignKey
ALTER TABLE "cluster_scores" DROP CONSTRAINT "cluster_scores_ibfk_cluster";

-- DropForeignKey
ALTER TABLE "cluster_scores" DROP CONSTRAINT "cluster_scores_ibfk_cycle";

-- DropForeignKey
ALTER TABLE "cluster_scores" DROP CONSTRAINT "cluster_scores_ibfk_review";

-- DropForeignKey
ALTER TABLE "identity_user_roles" DROP CONSTRAINT "identity_user_roles_ibfk_1";

-- DropForeignKey
ALTER TABLE "identity_user_roles" DROP CONSTRAINT "identity_user_roles_ibfk_2";

-- DropForeignKey
ALTER TABLE "library_clusters" DROP CONSTRAINT "library_clusters_ibfk_1";

-- DropForeignKey
ALTER TABLE "library_question_position" DROP CONSTRAINT "library_question_position_ibfk_1";

-- DropForeignKey
ALTER TABLE "library_question_position" DROP CONSTRAINT "library_question_position_ibfk_2";

-- DropForeignKey
ALTER TABLE "org_positions_hierarchy" DROP CONSTRAINT "org_positions_hierarchy_ibfk_1";

-- DropForeignKey
ALTER TABLE "org_positions_hierarchy" DROP CONSTRAINT "org_positions_hierarchy_ibfk_2";

-- DropForeignKey
ALTER TABLE "org_team_memberships" DROP CONSTRAINT "org_team_memberships_ibfk_1";

-- DropForeignKey
ALTER TABLE "reporting_report_analytics" DROP CONSTRAINT "reporting_report_analytics_ibfk_report";

-- DropForeignKey
ALTER TABLE "reporting_report_comments" DROP CONSTRAINT "reporting_report_comments_ibfk_report";

-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_cycle_id_fkey";

-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_review_id_fkey";

-- DropForeignKey
ALTER TABLE "respondents" DROP CONSTRAINT "respondents_ibfk_review";

-- DropForeignKey
ALTER TABLE "review_question_relations" DROP CONSTRAINT "review_question_relations_ibfk_library_question";

-- DropForeignKey
ALTER TABLE "review_question_relations" DROP CONSTRAINT "review_question_relations_ibfk_review";

-- DropForeignKey
ALTER TABLE "review_questions" DROP CONSTRAINT "review_questions_ibfk_competence";

-- DropForeignKey
ALTER TABLE "review_questions" DROP CONSTRAINT "review_questions_ibfk_cycle";

-- DropForeignKey
ALTER TABLE "review_questions" DROP CONSTRAINT "review_questions_ibfk_library_question";

-- DropForeignKey
ALTER TABLE "review_questions" DROP CONSTRAINT "review_questions_ibfk_position";

-- DropForeignKey
ALTER TABLE "reviewers" DROP CONSTRAINT "reviewers_ibfk_review";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_ibfk_cycle";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_ibfk_position";

-- AlterTable
ALTER TABLE "identity_users" DROP COLUMN "status",
ADD COLUMN     "status" "identity_status" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "library_questions" DROP COLUMN "answer_type",
ADD COLUMN     "answer_type" "library_answer_type" NOT NULL,
DROP COLUMN "question_status",
ADD COLUMN     "question_status" "library_question_status" NOT NULL DEFAULT 'active';

-- DropTable
DROP TABLE "answers";

-- DropTable
DROP TABLE "cluster_scores";

-- DropTable
DROP TABLE "cycles";

-- DropTable
DROP TABLE "identity_user_roles";

-- DropTable
DROP TABLE "library_question_position";

-- DropTable
DROP TABLE "org_positions_hierarchy";

-- DropTable
DROP TABLE "reporting_report_analytics";

-- DropTable
DROP TABLE "reporting_report_comments";

-- DropTable
DROP TABLE "reports";

-- DropTable
DROP TABLE "respondents";

-- DropTable
DROP TABLE "review_question_relations";

-- DropTable
DROP TABLE "review_questions";

-- DropTable
DROP TABLE "reviewers";

-- DropTable
DROP TABLE "reviews";

-- DropEnum
DROP TYPE "answer_type";

-- DropEnum
DROP TYPE "comment_sentiment";

-- DropEnum
DROP TYPE "cycle_stage";

-- DropEnum
DROP TYPE "entity_type";

-- DropEnum
DROP TYPE "identity_users_status";

-- DropEnum
DROP TYPE "question_status";

-- DropEnum
DROP TYPE "respondent_category";

-- DropEnum
DROP TYPE "response_status";

-- DropEnum
DROP TYPE "review_stage";

-- CreateTable
CREATE TABLE "identity_users_roles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role_code" "identity_role" NOT NULL,
    "assigned_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_users_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "org_position_hierarchies" (
    "id" SERIAL NOT NULL,
    "superior_position_id" INTEGER NOT NULL,
    "subordinate_position_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "org_position_hierarchies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_question_positions" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "position_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "library_question_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback360_cycles" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "hr_id" INTEGER NOT NULL,
    "stage" "feedback360_cycle_stage" NOT NULL DEFAULT 'new',
    "is_active" BOOLEAN DEFAULT true,
    "min_respondents_threshold" INTEGER NOT NULL DEFAULT 3,
    "start_date" TIMESTAMP(0) NOT NULL,
    "review_deadline" TIMESTAMP(0),
    "approval_deadline" TIMESTAMP(0),
    "response_deadline" TIMESTAMP(0),
    "end_date" TIMESTAMP(0) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback360_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback360_reviews" (
    "id" SERIAL NOT NULL,
    "ratee_id" INTEGER NOT NULL,
    "ratee_note" TEXT,
    "position_id" INTEGER NOT NULL,
    "hr_id" INTEGER NOT NULL,
    "hr_note" TEXT,
    "cycle_id" INTEGER,
    "report_id" INTEGER,
    "stage" "feedback360_review_stage" NOT NULL DEFAULT 'verification_by_hr',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback360_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback360_questions" (
    "id" SERIAL NOT NULL,
    "cycle_id" INTEGER,
    "library_question_id" INTEGER,
    "title" TEXT NOT NULL,
    "answer_type" "library_answer_type" NOT NULL,
    "competence_id" INTEGER,
    "position_id" INTEGER,
    "is_for_selfassessment" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback360_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback360_review_question_relations" (
    "id" SERIAL NOT NULL,
    "review_id" INTEGER NOT NULL,
    "library_question_id" INTEGER NOT NULL,
    "question_title" TEXT NOT NULL,
    "answer_type" "library_answer_type" NOT NULL,
    "competence_id" INTEGER NOT NULL,
    "is_for_selfassessment" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback360_review_question_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback360_answers" (
    "id" SERIAL NOT NULL,
    "review_id" INTEGER NOT NULL,
    "library_question_id" INTEGER NOT NULL,
    "review_question_id" INTEGER,
    "respondent_category" "feedback360_respondent_category" NOT NULL,
    "answer_type" "library_answer_type" NOT NULL DEFAULT 'numerical_scale',
    "numerical_value" SMALLINT,
    "text_value" TEXT,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback360_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback360_clusters_scores" (
    "id" SERIAL NOT NULL,
    "cycle_id" INTEGER,
    "cluster_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "review_id" INTEGER,
    "score" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback360_clusters_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback360_respondents" (
    "id" SERIAL NOT NULL,
    "review_id" INTEGER NOT NULL,
    "respondent_id" INTEGER NOT NULL,
    "respondent_category" "feedback360_respondent_category" NOT NULL,
    "response_status" "feedback360_response_status" NOT NULL DEFAULT 'pending',
    "respondent_note" TEXT,
    "invited_at" TIMESTAMP(0),
    "responded_at" TIMESTAMP(0),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback360_respondents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback360_reviewers" (
    "id" SERIAL NOT NULL,
    "review_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback360_reviewers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reporting_reports" (
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

    CONSTRAINT "reporting_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reporting_analytics" (
    "id" SERIAL NOT NULL,
    "report_id" INTEGER NOT NULL,
    "entity_type" "reporting_entity_type" NOT NULL,
    "entity_id" INTEGER,
    "entity_title" TEXT NOT NULL,
    "average_by_self_assessment" DOUBLE PRECISION,
    "average_by_team" DOUBLE PRECISION,
    "average_by_other" DOUBLE PRECISION,
    "delta_by_self_assessment" DOUBLE PRECISION,
    "delta_by_team" DOUBLE PRECISION,
    "delta_by_other" DOUBLE PRECISION,
    "dimension" VARCHAR(255),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reporting_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reporting_comments" (
    "id" SERIAL NOT NULL,
    "report_id" INTEGER NOT NULL,
    "comment" TEXT,
    "comment_sentiment" "reporting_comment_sentiment" NOT NULL DEFAULT 'positive',
    "number_of_mentions" INTEGER,
    "respondent_category" "feedback360_respondent_category" NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reporting_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "identity_users_roles_role_code_idx" ON "identity_users_roles"("role_code");

-- CreateIndex
CREATE INDEX "identity_users_roles_user_id_idx" ON "identity_users_roles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "identity_users_roles_user_id_role_code_key" ON "identity_users_roles"("user_id", "role_code");

-- CreateIndex
CREATE INDEX "org_position_hierarchies_subordinate_position_id_idx" ON "org_position_hierarchies"("subordinate_position_id");

-- CreateIndex
CREATE UNIQUE INDEX "org_position_hierarchies_superior_position_id_subordinate_p_key" ON "org_position_hierarchies"("superior_position_id", "subordinate_position_id");

-- CreateIndex
CREATE INDEX "library_question_positions_position_id_idx" ON "library_question_positions"("position_id");

-- CreateIndex
CREATE UNIQUE INDEX "library_question_positions_question_id_position_id_key" ON "library_question_positions"("question_id", "position_id");

-- CreateIndex
CREATE INDEX "feedback360_cycles_hr_id_idx" ON "feedback360_cycles"("hr_id");

-- CreateIndex
CREATE INDEX "feedback360_cycles_stage_idx" ON "feedback360_cycles"("stage");

-- CreateIndex
CREATE INDEX "feedback360_reviews_cycle_id_idx" ON "feedback360_reviews"("cycle_id");

-- CreateIndex
CREATE INDEX "feedback360_reviews_hr_id_idx" ON "feedback360_reviews"("hr_id");

-- CreateIndex
CREATE INDEX "feedback360_reviews_position_id_idx" ON "feedback360_reviews"("position_id");

-- CreateIndex
CREATE INDEX "feedback360_reviews_ratee_id_idx" ON "feedback360_reviews"("ratee_id");

-- CreateIndex
CREATE INDEX "feedback360_reviews_stage_idx" ON "feedback360_reviews"("stage");

-- CreateIndex
CREATE INDEX "feedback360_reviews_created_at_idx" ON "feedback360_reviews"("created_at");

-- CreateIndex
CREATE INDEX "feedback360_questions_cycle_id_idx" ON "feedback360_questions"("cycle_id");

-- CreateIndex
CREATE INDEX "feedback360_questions_library_question_id_idx" ON "feedback360_questions"("library_question_id");

-- CreateIndex
CREATE INDEX "feedback360_questions_competence_id_idx" ON "feedback360_questions"("competence_id");

-- CreateIndex
CREATE INDEX "feedback360_questions_position_id_idx" ON "feedback360_questions"("position_id");

-- CreateIndex
CREATE INDEX "feedback360_review_question_relations_review_id_idx" ON "feedback360_review_question_relations"("review_id");

-- CreateIndex
CREATE INDEX "feedback360_review_question_relations_library_question_id_idx" ON "feedback360_review_question_relations"("library_question_id");

-- CreateIndex
CREATE UNIQUE INDEX "feedback360_review_question_relations_review_id_library_que_key" ON "feedback360_review_question_relations"("review_id", "library_question_id");

-- CreateIndex
CREATE INDEX "feedback360_answers_review_id_idx" ON "feedback360_answers"("review_id");

-- CreateIndex
CREATE INDEX "feedback360_answers_library_question_id_idx" ON "feedback360_answers"("library_question_id");

-- CreateIndex
CREATE INDEX "feedback360_answers_review_question_id_idx" ON "feedback360_answers"("review_question_id");

-- CreateIndex
CREATE INDEX "feedback360_answers_respondent_category_idx" ON "feedback360_answers"("respondent_category");

-- CreateIndex
CREATE INDEX "feedback360_answers_created_at_idx" ON "feedback360_answers"("created_at");

-- CreateIndex
CREATE INDEX "feedback360_clusters_scores_cycle_id_idx" ON "feedback360_clusters_scores"("cycle_id");

-- CreateIndex
CREATE INDEX "feedback360_clusters_scores_cluster_id_idx" ON "feedback360_clusters_scores"("cluster_id");

-- CreateIndex
CREATE INDEX "feedback360_clusters_scores_user_id_idx" ON "feedback360_clusters_scores"("user_id");

-- CreateIndex
CREATE INDEX "feedback360_clusters_scores_review_id_idx" ON "feedback360_clusters_scores"("review_id");

-- CreateIndex
CREATE UNIQUE INDEX "feedback360_clusters_scores_cluster_id_user_id_key" ON "feedback360_clusters_scores"("cluster_id", "user_id");

-- CreateIndex
CREATE INDEX "feedback360_respondents_review_id_idx" ON "feedback360_respondents"("review_id");

-- CreateIndex
CREATE INDEX "feedback360_respondents_response_status_idx" ON "feedback360_respondents"("response_status");

-- CreateIndex
CREATE INDEX "feedback360_respondents_respondent_id_idx" ON "feedback360_respondents"("respondent_id");

-- CreateIndex
CREATE INDEX "feedback360_respondents_respondent_id_response_status_idx" ON "feedback360_respondents"("respondent_id", "response_status");

-- CreateIndex
CREATE UNIQUE INDEX "feedback360_respondents_respondent_id_review_id_key" ON "feedback360_respondents"("respondent_id", "review_id");

-- CreateIndex
CREATE INDEX "feedback360_reviewers_review_id_idx" ON "feedback360_reviewers"("review_id");

-- CreateIndex
CREATE INDEX "feedback360_reviewers_user_id_idx" ON "feedback360_reviewers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "feedback360_reviewers_review_id_user_id_key" ON "feedback360_reviewers"("review_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "reporting_reports_review_id_key" ON "reporting_reports"("review_id");

-- CreateIndex
CREATE INDEX "reporting_reports_cycle_id_idx" ON "reporting_reports"("cycle_id");

-- CreateIndex
CREATE INDEX "reporting_analytics_report_id_idx" ON "reporting_analytics"("report_id");

-- CreateIndex
CREATE UNIQUE INDEX "reporting_analytics_report_id_entity_type_entity_id_key" ON "reporting_analytics"("report_id", "entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "reporting_comments_report_id_idx" ON "reporting_comments"("report_id");

-- CreateIndex
CREATE INDEX "identity_users_status_idx" ON "identity_users"("status");

-- RenameForeignKey
ALTER TABLE "identity_users" RENAME CONSTRAINT "identity_users_ibfk_1" TO "identity_users_manager_id_fkey";

-- RenameForeignKey
ALTER TABLE "library_clusters" RENAME CONSTRAINT "library_clusters_ibfk_2" TO "library_clusters_competence_id_fkey";

-- RenameForeignKey
ALTER TABLE "library_questions" RENAME CONSTRAINT "library_questions_ibfk_1" TO "library_questions_competence_id_fkey";

-- AddForeignKey
ALTER TABLE "identity_users_roles" ADD CONSTRAINT "identity_users_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_users_roles" ADD CONSTRAINT "identity_users_roles_role_code_fkey" FOREIGN KEY ("role_code") REFERENCES "identity_roles"("code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "org_teams" ADD CONSTRAINT "org_teams_head_id_fkey" FOREIGN KEY ("head_id") REFERENCES "identity_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "org_team_memberships" ADD CONSTRAINT "org_team_memberships_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "org_teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "org_team_memberships" ADD CONSTRAINT "org_team_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "org_position_hierarchies" ADD CONSTRAINT "org_position_hierarchies_superior_position_id_fkey" FOREIGN KEY ("superior_position_id") REFERENCES "org_positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "org_position_hierarchies" ADD CONSTRAINT "org_position_hierarchies_subordinate_position_id_fkey" FOREIGN KEY ("subordinate_position_id") REFERENCES "org_positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_clusters" ADD CONSTRAINT "library_clusters_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "feedback360_cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_question_positions" ADD CONSTRAINT "library_question_positions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "library_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "library_question_positions" ADD CONSTRAINT "library_question_positions_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "org_positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_cycles" ADD CONSTRAINT "feedback360_cycles_hr_id_fkey" FOREIGN KEY ("hr_id") REFERENCES "identity_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_reviews" ADD CONSTRAINT "feedback360_reviews_ratee_id_fkey" FOREIGN KEY ("ratee_id") REFERENCES "identity_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_reviews" ADD CONSTRAINT "feedback360_reviews_hr_id_fkey" FOREIGN KEY ("hr_id") REFERENCES "identity_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_reviews" ADD CONSTRAINT "feedback360_reviews_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "feedback360_cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_reviews" ADD CONSTRAINT "feedback360_reviews_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "org_positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_questions" ADD CONSTRAINT "feedback360_questions_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "feedback360_cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_questions" ADD CONSTRAINT "feedback360_questions_library_question_id_fkey" FOREIGN KEY ("library_question_id") REFERENCES "library_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_questions" ADD CONSTRAINT "feedback360_questions_competence_id_fkey" FOREIGN KEY ("competence_id") REFERENCES "library_competences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_questions" ADD CONSTRAINT "feedback360_questions_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "org_positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_review_question_relations" ADD CONSTRAINT "feedback360_review_question_relations_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "feedback360_reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_review_question_relations" ADD CONSTRAINT "feedback360_review_question_relations_library_question_id_fkey" FOREIGN KEY ("library_question_id") REFERENCES "library_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_answers" ADD CONSTRAINT "feedback360_answers_library_question_id_fkey" FOREIGN KEY ("library_question_id") REFERENCES "library_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_answers" ADD CONSTRAINT "feedback360_answers_review_question_id_fkey" FOREIGN KEY ("review_question_id") REFERENCES "feedback360_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_answers" ADD CONSTRAINT "feedback360_answers_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "feedback360_reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_clusters_scores" ADD CONSTRAINT "feedback360_clusters_scores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_clusters_scores" ADD CONSTRAINT "feedback360_clusters_scores_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "feedback360_cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_clusters_scores" ADD CONSTRAINT "feedback360_clusters_scores_cluster_id_fkey" FOREIGN KEY ("cluster_id") REFERENCES "library_clusters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_clusters_scores" ADD CONSTRAINT "feedback360_clusters_scores_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "feedback360_reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_respondents" ADD CONSTRAINT "feedback360_respondents_respondent_id_fkey" FOREIGN KEY ("respondent_id") REFERENCES "identity_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_respondents" ADD CONSTRAINT "feedback360_respondents_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "feedback360_reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_reviewers" ADD CONSTRAINT "feedback360_reviewers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_reviewers" ADD CONSTRAINT "feedback360_reviewers_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "feedback360_reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporting_reports" ADD CONSTRAINT "reporting_reports_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "feedback360_reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporting_reports" ADD CONSTRAINT "reporting_reports_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "feedback360_cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporting_analytics" ADD CONSTRAINT "reporting_analytics_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reporting_reports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporting_comments" ADD CONSTRAINT "reporting_comments_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reporting_reports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- RenameIndex
ALTER INDEX "identity_unique_role_code" RENAME TO "identity_roles_code_key";

-- RenameIndex
ALTER INDEX "email" RENAME TO "identity_users_email_key";

-- RenameIndex
ALTER INDEX "identity_idx_manager" RENAME TO "identity_users_manager_id_idx";

-- RenameIndex
ALTER INDEX "identity_idx_position" RENAME TO "identity_users_position_id_idx";

-- RenameIndex
ALTER INDEX "identity_idx_team" RENAME TO "identity_users_team_id_idx";

-- RenameIndex
ALTER INDEX "identity_idx_title" RENAME TO "identity_users_full_name_idx";

-- RenameIndex
ALTER INDEX "cluster_idx_competence" RENAME TO "library_clusters_competence_id_idx";

-- RenameIndex
ALTER INDEX "cluster_idx_cycle" RENAME TO "library_clusters_cycle_id_idx";

-- RenameIndex
ALTER INDEX "library_unique_competence_cluster" RENAME TO "library_clusters_cycle_id_competence_id_lower_bound_upper_b_key";

-- RenameIndex
ALTER INDEX "library_unique_competence_code" RENAME TO "library_competences_code_key";

-- RenameIndex
ALTER INDEX "library_unique_competence_title" RENAME TO "library_competences_title_key";

-- RenameIndex
ALTER INDEX "question_idx_competence" RENAME TO "library_questions_competence_id_idx";

-- RenameIndex
ALTER INDEX "org_idx_team" RENAME TO "org_team_memberships_team_id_idx";

-- RenameIndex
ALTER INDEX "org_idx_user" RENAME TO "org_team_memberships_user_id_idx";

-- RenameIndex
ALTER INDEX "org_unique_team_member" RENAME TO "org_team_memberships_team_id_user_id_is_primary_key";

-- RenameIndex
ALTER INDEX "org_idx_head" RENAME TO "org_teams_head_id_idx";
