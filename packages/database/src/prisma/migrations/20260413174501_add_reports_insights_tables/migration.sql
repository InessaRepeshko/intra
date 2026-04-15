/*
  Warnings:

  - You are about to drop the `reporting_analytics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reporting_comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reporting_reports` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "reporting_insight_type" AS ENUM ('highest_rating', 'lowest_rating', 'highest_delta', 'lowest_delta');

-- DropForeignKey
ALTER TABLE "reporting_analytics" DROP CONSTRAINT "reporting_analytics_competence_id_fkey";

-- DropForeignKey
ALTER TABLE "reporting_analytics" DROP CONSTRAINT "reporting_analytics_question_id_fkey";

-- DropForeignKey
ALTER TABLE "reporting_analytics" DROP CONSTRAINT "reporting_analytics_report_id_fkey";

-- DropForeignKey
ALTER TABLE "reporting_comments" DROP CONSTRAINT "reporting_comments_question_id_fkey";

-- DropForeignKey
ALTER TABLE "reporting_comments" DROP CONSTRAINT "reporting_comments_report_id_fkey";

-- DropForeignKey
ALTER TABLE "reporting_reports" DROP CONSTRAINT "reporting_reports_cycle_id_fkey";

-- DropForeignKey
ALTER TABLE "reporting_reports" DROP CONSTRAINT "reporting_reports_review_id_fkey";

-- DropTable
DROP TABLE "reporting_analytics";

-- DropTable
DROP TABLE "reporting_comments";

-- DropTable
DROP TABLE "reporting_reports";

-- CreateTable
CREATE TABLE "reporting_individual_reports" (
    "id" SERIAL NOT NULL,
    "review_id" INTEGER NOT NULL,
    "cycle_id" INTEGER,
    "respondent_count" INTEGER NOT NULL,
    "respondent_categories" "feedback360_respondent_category"[],
    "answer_count" INTEGER NOT NULL,
    "turnout_pct_of_team" DECIMAL(10,4),
    "turnout_pct_of_other" DECIMAL(10,4),
    "question_tot_avg_by_self" DECIMAL(10,4),
    "question_tot_avg_by_team" DECIMAL(10,4),
    "question_tot_avg_by_others" DECIMAL(10,4),
    "question_tot_pct_by_self" DECIMAL(10,4),
    "question_tot_pct_by_team" DECIMAL(10,4),
    "question_tot_pct_by_others" DECIMAL(10,4),
    "question_tot_delta_pct_by_team" DECIMAL(10,4),
    "question_tot_delta_pct_by_others" DECIMAL(10,4),
    "competence_tot_avg_by_self" DECIMAL(10,4),
    "competence_tot_avg_by_team" DECIMAL(10,4),
    "competence_tot_avg_by_others" DECIMAL(10,4),
    "competence_tot_pct_by_self" DECIMAL(10,4),
    "competence_tot_pct_by_team" DECIMAL(10,4),
    "competence_tot_pct_by_others" DECIMAL(10,4),
    "competence_tot_delta_pct_by_team" DECIMAL(10,4),
    "competence_tot_delta_pct_by_others" DECIMAL(10,4),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reporting_individual_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reporting_individual_report_analytics" (
    "id" SERIAL NOT NULL,
    "report_id" INTEGER NOT NULL,
    "entity_type" "reporting_entity_type" NOT NULL,
    "question_id" INTEGER,
    "question_title" TEXT,
    "competence_id" INTEGER,
    "competence_title" TEXT,
    "average_by_self_assessment" DECIMAL(10,4),
    "average_by_team" DECIMAL(10,4),
    "average_by_other" DECIMAL(10,4),
    "percentage_by_self_assessment" DECIMAL(10,4),
    "percentage_by_team" DECIMAL(10,4),
    "percentage_by_other" DECIMAL(10,4),
    "delta_percentage_by_team" DECIMAL(10,4),
    "delta_percentage_by_other" DECIMAL(10,4),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reporting_individual_report_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reporting_individual_report_insights" (
    "id" SERIAL NOT NULL,
    "report_id" INTEGER NOT NULL,
    "insight_type" "reporting_insight_type" NOT NULL,
    "entity_type" "reporting_entity_type" NOT NULL,
    "question_id" INTEGER,
    "question_title" TEXT,
    "competence_id" INTEGER,
    "competence_title" TEXT,
    "average_score" DECIMAL(10,4),
    "average_rating" DECIMAL(10,4),
    "average_delta" DECIMAL(10,4),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reporting_individual_report_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reporting_individual_report_comments" (
    "id" SERIAL NOT NULL,
    "report_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "question_title" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "respondent_categories" "feedback360_respondent_category"[],
    "comment_sentiment" "reporting_comment_sentiment" DEFAULT 'positive',
    "number_of_mentions" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reporting_individual_report_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reporting_strategic_report_insights" (
    "id" SERIAL NOT NULL,
    "strategic_report_id" INTEGER NOT NULL,
    "insight_type" "reporting_insight_type" NOT NULL,
    "competence_id" INTEGER NOT NULL,
    "competence_title" TEXT NOT NULL,
    "average_score" DECIMAL(10,4),
    "average_rating" DECIMAL(10,4),
    "average_delta" DECIMAL(10,4),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reporting_strategic_report_insights_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reporting_individual_reports_review_id_key" ON "reporting_individual_reports"("review_id");

-- CreateIndex
CREATE INDEX "reporting_individual_reports_cycle_id_idx" ON "reporting_individual_reports"("cycle_id");

-- CreateIndex
CREATE INDEX "reporting_individual_report_analytics_report_id_idx" ON "reporting_individual_report_analytics"("report_id");

-- CreateIndex
CREATE INDEX "reporting_individual_report_analytics_question_id_idx" ON "reporting_individual_report_analytics"("question_id");

-- CreateIndex
CREATE INDEX "reporting_individual_report_analytics_competence_id_idx" ON "reporting_individual_report_analytics"("competence_id");

-- CreateIndex
CREATE INDEX "reporting_individual_report_insights_report_id_idx" ON "reporting_individual_report_insights"("report_id");

-- CreateIndex
CREATE INDEX "reporting_individual_report_insights_question_id_idx" ON "reporting_individual_report_insights"("question_id");

-- CreateIndex
CREATE INDEX "reporting_individual_report_insights_competence_id_idx" ON "reporting_individual_report_insights"("competence_id");

-- CreateIndex
CREATE INDEX "reporting_individual_report_comments_report_id_idx" ON "reporting_individual_report_comments"("report_id");

-- CreateIndex
CREATE INDEX "reporting_individual_report_comments_question_id_idx" ON "reporting_individual_report_comments"("question_id");

-- CreateIndex
CREATE INDEX "reporting_strategic_report_insights_strategic_report_id_idx" ON "reporting_strategic_report_insights"("strategic_report_id");

-- CreateIndex
CREATE INDEX "reporting_strategic_report_insights_competence_id_idx" ON "reporting_strategic_report_insights"("competence_id");

-- AddForeignKey
ALTER TABLE "reporting_individual_reports" ADD CONSTRAINT "reporting_individual_reports_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "feedback360_reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporting_individual_reports" ADD CONSTRAINT "reporting_individual_reports_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "feedback360_cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporting_individual_report_analytics" ADD CONSTRAINT "reporting_individual_report_analytics_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reporting_individual_reports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporting_individual_report_analytics" ADD CONSTRAINT "reporting_individual_report_analytics_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "feedback360_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporting_individual_report_analytics" ADD CONSTRAINT "reporting_individual_report_analytics_competence_id_fkey" FOREIGN KEY ("competence_id") REFERENCES "library_competences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporting_individual_report_insights" ADD CONSTRAINT "reporting_individual_report_insights_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reporting_individual_reports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporting_individual_report_insights" ADD CONSTRAINT "reporting_individual_report_insights_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "feedback360_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporting_individual_report_insights" ADD CONSTRAINT "reporting_individual_report_insights_competence_id_fkey" FOREIGN KEY ("competence_id") REFERENCES "library_competences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporting_individual_report_comments" ADD CONSTRAINT "reporting_individual_report_comments_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reporting_individual_reports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporting_individual_report_comments" ADD CONSTRAINT "reporting_individual_report_comments_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "feedback360_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporting_strategic_report_insights" ADD CONSTRAINT "reporting_strategic_report_insights_strategic_report_id_fkey" FOREIGN KEY ("strategic_report_id") REFERENCES "reporting_strategic_reports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reporting_strategic_report_insights" ADD CONSTRAINT "reporting_strategic_report_insights_competence_id_fkey" FOREIGN KEY ("competence_id") REFERENCES "library_competences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
