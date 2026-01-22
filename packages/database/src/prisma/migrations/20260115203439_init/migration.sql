-- CreateEnum
CREATE TYPE "identity_role" AS ENUM ('admin', 'hr', 'manager', 'employee');

-- CreateEnum
CREATE TYPE "identity_users_status" AS ENUM ('inactive', 'active');

-- CreateEnum
CREATE TYPE "competence_questions_answer_type" AS ENUM ('numerical_scale', 'text_field');

-- CreateEnum
CREATE TYPE "competence_question_status" AS ENUM ('archive', 'active');

-- CreateEnum
CREATE TYPE "cycle_stage" AS ENUM ('canceled', 'new', 'active', 'finished', 'archive');

-- CreateEnum
CREATE TYPE "feedback360_status" AS ENUM ('pending', 'inprogress', 'completed', 'canceled');

-- CreateEnum
CREATE TYPE "feedback360_stage" AS ENUM ('canceled', 'verification_by_hr', 'verification_by_user', 'rejected', 'self_assessment', 'waiting_to_start', 'in_progress', 'research', 'finished');

-- CreateEnum
CREATE TYPE "respondent_category" AS ENUM ('self_assessment', 'team', 'other');

-- CreateEnum
CREATE TYPE "entity_type" AS ENUM ('question', 'competence');

-- CreateEnum
CREATE TYPE "comment_sentiment" AS ENUM ('negative', 'positive');

-- CreateTable
CREATE TABLE "identity_users" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "second_name" VARCHAR(100),
    "last_name" VARCHAR(100) NOT NULL,
    "full_name" VARCHAR(302),
    "email" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(300) NOT NULL,
    "status" "identity_users_status" NOT NULL DEFAULT 'active',
    "position_id" INTEGER,
    "team_id" INTEGER,
    "manager_id" INTEGER,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_roles" (
    "id" SERIAL NOT NULL,
    "code" "identity_role" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_user_roles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role_code" "identity_role" NOT NULL,
    "assigned_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "org_teams" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "head_id" INTEGER,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "org_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "org_team_memberships" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "is_primary" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "org_team_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "org_positions" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "org_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "org_positions_hierarchy" (
    "id" SERIAL NOT NULL,
    "parent_position_id" INTEGER NOT NULL,
    "child_position_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "org_positions_hierarchy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competence_competences" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(100),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competence_competences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competence_clusters" (
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

    CONSTRAINT "competence_clusters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competence_questions" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "answer_type" "competence_questions_answer_type" NOT NULL,
    "competence_id" INTEGER NOT NULL,
    "is_for_selfassessment" BOOLEAN DEFAULT false,
    "question_status" "competence_question_status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competence_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competence_question_positions" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "position_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competence_question_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback360_cycles" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "hr_id" INTEGER NOT NULL,
    "stage" "cycle_stage" NOT NULL DEFAULT 'new',
    "is_active" BOOLEAN DEFAULT true,
    "start_date" TIMESTAMP(0) NOT NULL,
    "review_deadline" TIMESTAMP(0),
    "approval_deadline" TIMESTAMP(0),
    "survey_deadline" TIMESTAMP(0),
    "end_date" TIMESTAMP(0) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback360_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback360_feedbacks" (
    "id" SERIAL NOT NULL,
    "ratee_id" INTEGER NOT NULL,
    "ratee_note" TEXT,
    "position_id" INTEGER NOT NULL,
    "hr_id" INTEGER NOT NULL,
    "hr_note" TEXT,
    "cycle_id" INTEGER,
    "stage" "feedback360_stage" NOT NULL DEFAULT 'verification_by_hr',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback360_feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback360_questions" (
    "id" SERIAL NOT NULL,
    "cycle_id" INTEGER,
    "question_id" INTEGER,
    "title" TEXT NOT NULL,
    "answer_type" "competence_questions_answer_type" NOT NULL,
    "competence_id" INTEGER,
    "position_id" INTEGER,
    "is_for_selfassessment" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback360_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback360_questions_relations" (
    "id" SERIAL NOT NULL,
    "feedback360_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "question_title" TEXT NOT NULL,
    "answer_type" "competence_questions_answer_type" NOT NULL,
    "competence_id" INTEGER NOT NULL,
    "is_for_selfassessment" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback360_questions_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback360_answers" (
    "id" SERIAL NOT NULL,
    "feedback360_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "feedback360_question_id" INTEGER,
    "respondent_category" "respondent_category" NOT NULL,
    "answer_type" "competence_questions_answer_type" NOT NULL DEFAULT 'numerical_scale',
    "numerical_value" SMALLINT,
    "text_value" TEXT,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback360_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback360_cluster_scores" (
    "id" SERIAL NOT NULL,
    "cycle_id" INTEGER,
    "cluster_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "feedback360_id" INTEGER,
    "score" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback360_cluster_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback360_respondents_relations" (
    "id" SERIAL NOT NULL,
    "feedback360_id" INTEGER NOT NULL,
    "respondent_id" INTEGER NOT NULL,
    "respondent_category" "respondent_category" NOT NULL,
    "feedback360_status" "feedback360_status" NOT NULL DEFAULT 'pending',
    "respondent_note" TEXT,
    "invited_at" TIMESTAMP(0),
    "responded_at" TIMESTAMP(0),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback360_respondents_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback360_reviewers_relations" (
    "id" SERIAL NOT NULL,
    "feedback360_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback360_reviewers_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reporting_feedback360_reports" (
    "id" SERIAL NOT NULL,
    "feedback360_id" INTEGER NOT NULL,
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

    CONSTRAINT "reporting_feedback360_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reporting_report_analytics" (
    "id" SERIAL NOT NULL,
    "report_id" INTEGER NOT NULL,
    "entity_type" "entity_type" NOT NULL,
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

    CONSTRAINT "reporting_report_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reporting_report_comments" (
    "id" SERIAL NOT NULL,
    "report_id" INTEGER NOT NULL,
    "comment" TEXT,
    "comment_sentiment" "comment_sentiment" NOT NULL DEFAULT 'positive',
    "number_of_mentions" INTEGER,
    "respondent_category" "respondent_category" NOT NULL,
    "author_id" INTEGER,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reporting_report_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email" ON "identity_users"("email");

-- CreateIndex
CREATE INDEX "identity_idx_manager" ON "identity_users"("manager_id");

-- CreateIndex
CREATE INDEX "identity_idx_position" ON "identity_users"("position_id");

-- CreateIndex
CREATE INDEX "identity_idx_team" ON "identity_users"("team_id");

-- CreateIndex
CREATE INDEX "identity_idx_title" ON "identity_users"("full_name");

-- CreateIndex
CREATE UNIQUE INDEX "identity_unique_role_code" ON "identity_roles"("code");

-- CreateIndex
CREATE INDEX "identity_idx_role_code" ON "identity_user_roles"("role_code");

-- CreateIndex
CREATE INDEX "identity_idx_user_id" ON "identity_user_roles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "identity_unique_user_role" ON "identity_user_roles"("user_id", "role_code");

-- CreateIndex
CREATE INDEX "org_idx_head" ON "org_teams"("head_id");

-- CreateIndex
CREATE INDEX "org_idx_team" ON "org_team_memberships"("team_id");

-- CreateIndex
CREATE INDEX "org_idx_user" ON "org_team_memberships"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "org_unique_team_member" ON "org_team_memberships"("team_id", "user_id", "is_primary");

-- CreateIndex
CREATE INDEX "org_idx_child_position" ON "org_positions_hierarchy"("child_position_id");

-- CreateIndex
CREATE UNIQUE INDEX "org_unique_position_hierarchy" ON "org_positions_hierarchy"("parent_position_id", "child_position_id");

-- CreateIndex
CREATE UNIQUE INDEX "competence_unique_competence_code" ON "competence_competences"("code");

-- CreateIndex
CREATE UNIQUE INDEX "competence_unique_competence_title" ON "competence_competences"("title");

-- CreateIndex
CREATE INDEX "competence_cluster_idx_competence" ON "competence_clusters"("competence_id");

-- CreateIndex
CREATE INDEX "competence_idx_cycle" ON "competence_clusters"("cycle_id");

-- CreateIndex
CREATE UNIQUE INDEX "competence_unique_competence_cluster" ON "competence_clusters"("cycle_id", "competence_id", "lower_bound", "upper_bound");

-- CreateIndex
CREATE INDEX "question_idx_competence" ON "competence_questions"("competence_id");

-- CreateIndex
CREATE INDEX "competence_position_id" ON "competence_question_positions"("position_id");

-- CreateIndex
CREATE UNIQUE INDEX "competence_unique_relation" ON "competence_question_positions"("question_id", "position_id");

-- CreateIndex
CREATE INDEX "feedback360_cycles_idx_hr" ON "feedback360_cycles"("hr_id");

-- CreateIndex
CREATE INDEX "feedback360_cycles_idx_stage" ON "feedback360_cycles"("stage");

-- CreateIndex
CREATE INDEX "feedback360_feedbacks_idx_cycle" ON "feedback360_feedbacks"("cycle_id");

-- CreateIndex
CREATE INDEX "feedback360_feedbacks_idx_hr" ON "feedback360_feedbacks"("hr_id");

-- CreateIndex
CREATE INDEX "feedback360_feedbacks_idx_position" ON "feedback360_feedbacks"("position_id");

-- CreateIndex
CREATE INDEX "feedback360_feedbacks_idx_ratee" ON "feedback360_feedbacks"("ratee_id");

-- CreateIndex
CREATE INDEX "feedback360_feedbacks_idx_stage" ON "feedback360_feedbacks"("stage");

-- CreateIndex
CREATE INDEX "feedback360_questions_idx_cycle" ON "feedback360_questions"("cycle_id");

-- CreateIndex
CREATE INDEX "feedback360_questions_idx_question" ON "feedback360_questions"("question_id");

-- CreateIndex
CREATE INDEX "feedback360_questions_idx_competence" ON "feedback360_questions"("competence_id");

-- CreateIndex
CREATE INDEX "feedback360_questions_idx_position" ON "feedback360_questions"("position_id");

-- CreateIndex
CREATE INDEX "feedback360_questions_relations_idx_feedback360" ON "feedback360_questions_relations"("feedback360_id");

-- CreateIndex
CREATE INDEX "feedback360_questions_relations_idx_question_id" ON "feedback360_questions_relations"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "feedback360_unique_feedback_template" ON "feedback360_questions_relations"("feedback360_id", "question_id");

-- CreateIndex
CREATE INDEX "feedback360_answers_idx_feedback360" ON "feedback360_answers"("feedback360_id");

-- CreateIndex
CREATE INDEX "feedback360_answers_idx_question" ON "feedback360_answers"("question_id");

-- CreateIndex
CREATE INDEX "feedback360_answers_idx_feedback360_question" ON "feedback360_answers"("feedback360_question_id");

-- CreateIndex
CREATE INDEX "feedback360_idx_cycle" ON "feedback360_cluster_scores"("cycle_id");

-- CreateIndex
CREATE INDEX "feedback360_idx_cluster" ON "feedback360_cluster_scores"("cluster_id");

-- CreateIndex
CREATE INDEX "feedback360_idx_user" ON "feedback360_cluster_scores"("user_id");

-- CreateIndex
CREATE INDEX "feedback360_idx_feedback360" ON "feedback360_cluster_scores"("feedback360_id");

-- CreateIndex
CREATE UNIQUE INDEX "feedback360_unique_cluster_member" ON "feedback360_cluster_scores"("cluster_id", "user_id");

-- CreateIndex
CREATE INDEX "feedback360_respondents_idx_feedback360" ON "feedback360_respondents_relations"("feedback360_id");

-- CreateIndex
CREATE INDEX "feedback360_respondents_idx_feedback360_status" ON "feedback360_respondents_relations"("feedback360_status");

-- CreateIndex
CREATE INDEX "feedback360_respondents_idx_respondent" ON "feedback360_respondents_relations"("respondent_id");

-- CreateIndex
CREATE INDEX "feedback360_respondents_idx_respondent_feedback360_status" ON "feedback360_respondents_relations"("respondent_id", "feedback360_status");

-- CreateIndex
CREATE UNIQUE INDEX "feedback360_respondents_unique_feedback" ON "feedback360_respondents_relations"("respondent_id", "feedback360_id");

-- CreateIndex
CREATE INDEX "feedback360_reviewers_idx_feedback360" ON "feedback360_reviewers_relations"("feedback360_id");

-- CreateIndex
CREATE INDEX "feedback360_reviewers_idx_user" ON "feedback360_reviewers_relations"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "feedback360_reviewers_unique_feedback_reviewer" ON "feedback360_reviewers_relations"("feedback360_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "reporting_feedback360_reports_unique_feedback360" ON "reporting_feedback360_reports"("feedback360_id");

-- CreateIndex
CREATE INDEX "reporting_feedback360_reports_idx_cycle" ON "reporting_feedback360_reports"("cycle_id");

-- CreateIndex
CREATE INDEX "reporting_report_analytics_idx_report" ON "reporting_report_analytics"("report_id");

-- CreateIndex
CREATE UNIQUE INDEX "reporting_unique_report_entity" ON "reporting_report_analytics"("report_id", "entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "reporting_report_comments_idx_report" ON "reporting_report_comments"("report_id");

-- CreateIndex
CREATE INDEX "reporting_report_comments_idx_author" ON "reporting_report_comments"("author_id");

-- AddForeignKey
ALTER TABLE "identity_users" ADD CONSTRAINT "identity_users_ibfk_1" FOREIGN KEY ("manager_id") REFERENCES "identity_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_user_roles" ADD CONSTRAINT "identity_user_roles_ibfk_1" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identity_user_roles" ADD CONSTRAINT "identity_user_roles_ibfk_2" FOREIGN KEY ("role_code") REFERENCES "identity_roles"("code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "org_team_memberships" ADD CONSTRAINT "org_team_memberships_ibfk_1" FOREIGN KEY ("team_id") REFERENCES "org_teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "org_positions_hierarchy" ADD CONSTRAINT "org_positions_hierarchy_ibfk_1" FOREIGN KEY ("parent_position_id") REFERENCES "org_positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "org_positions_hierarchy" ADD CONSTRAINT "org_positions_hierarchy_ibfk_2" FOREIGN KEY ("child_position_id") REFERENCES "org_positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "competence_clusters" ADD CONSTRAINT "competence_clusters_ibfk_1" FOREIGN KEY ("cycle_id") REFERENCES "feedback360_cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "competence_clusters" ADD CONSTRAINT "competence_clusters_ibfk_2" FOREIGN KEY ("competence_id") REFERENCES "competence_competences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "competence_questions" ADD CONSTRAINT "competence_questions_ibfk_1" FOREIGN KEY ("competence_id") REFERENCES "competence_competences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "competence_question_positions" ADD CONSTRAINT "competence_question_positions_ibfk_1" FOREIGN KEY ("question_id") REFERENCES "competence_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "competence_question_positions" ADD CONSTRAINT "competence_question_positions_ibfk_2" FOREIGN KEY ("position_id") REFERENCES "org_positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_feedbacks" ADD CONSTRAINT "feedback360_feedbacks_ibfk_cycle" FOREIGN KEY ("cycle_id") REFERENCES "feedback360_cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_feedbacks" ADD CONSTRAINT "feedback360_feedbacks_ibfk_position" FOREIGN KEY ("position_id") REFERENCES "org_positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_questions" ADD CONSTRAINT "feedback360_questions_ibfk_cycle" FOREIGN KEY ("cycle_id") REFERENCES "feedback360_cycles"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_questions" ADD CONSTRAINT "feedback360_questions_ibfk_question" FOREIGN KEY ("question_id") REFERENCES "competence_questions"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_questions" ADD CONSTRAINT "feedback360_questions_ibfk_competence" FOREIGN KEY ("competence_id") REFERENCES "competence_competences"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_questions" ADD CONSTRAINT "feedback360_questions_ibfk_position" FOREIGN KEY ("position_id") REFERENCES "org_positions"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_questions_relations" ADD CONSTRAINT "feedback360_questions_relations_ibfk_feedback360" FOREIGN KEY ("feedback360_id") REFERENCES "feedback360_feedbacks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_questions_relations" ADD CONSTRAINT "feedback360_questions_relations_ibfk_question" FOREIGN KEY ("question_id") REFERENCES "competence_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_answers" ADD CONSTRAINT "feedback360_answers_ibfk_question" FOREIGN KEY ("question_id") REFERENCES "competence_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_answers" ADD CONSTRAINT "feedback360_answers_ibfk_feedback360_question" FOREIGN KEY ("feedback360_question_id") REFERENCES "feedback360_questions"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_answers" ADD CONSTRAINT "feedback360_answers_ibfk_feedback360" FOREIGN KEY ("feedback360_id") REFERENCES "feedback360_feedbacks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_cluster_scores" ADD CONSTRAINT "feedback360_cluster_scores_ibfk_cycle" FOREIGN KEY ("cycle_id") REFERENCES "feedback360_cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_cluster_scores" ADD CONSTRAINT "feedback360_cluster_scores_ibfk_cluster" FOREIGN KEY ("cluster_id") REFERENCES "competence_clusters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_cluster_scores" ADD CONSTRAINT "feedback360_cluster_scores_ibfk_feedback360" FOREIGN KEY ("feedback360_id") REFERENCES "feedback360_feedbacks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_respondents_relations" ADD CONSTRAINT "feedback360_respondents_relations_ibfk_feedback360" FOREIGN KEY ("feedback360_id") REFERENCES "feedback360_feedbacks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_reviewers_relations" ADD CONSTRAINT "feedback360_reviewers_relations_ibfk_feedback360" FOREIGN KEY ("feedback360_id") REFERENCES "feedback360_feedbacks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporting_feedback360_reports" ADD CONSTRAINT "reporting_feedback360_reports_ibfk_feedback360" FOREIGN KEY ("feedback360_id") REFERENCES "feedback360_feedbacks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporting_feedback360_reports" ADD CONSTRAINT "reporting_feedback360_reports_ibfk_cycle" FOREIGN KEY ("cycle_id") REFERENCES "feedback360_cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporting_report_analytics" ADD CONSTRAINT "reporting_report_analytics_ibfk_report" FOREIGN KEY ("report_id") REFERENCES "reporting_feedback360_reports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporting_report_comments" ADD CONSTRAINT "reporting_report_comments_ibfk_report" FOREIGN KEY ("report_id") REFERENCES "reporting_feedback360_reports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
