/*
  Warnings:

  - You are about to drop the `feedback360_clusters_scores` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `feedback360_cycle_cluster_analytics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "feedback360_clusters_scores" DROP CONSTRAINT "feedback360_clusters_scores_cluster_id_fkey";

-- DropForeignKey
ALTER TABLE "feedback360_clusters_scores" DROP CONSTRAINT "feedback360_clusters_scores_cycle_id_fkey";

-- DropForeignKey
ALTER TABLE "feedback360_clusters_scores" DROP CONSTRAINT "feedback360_clusters_scores_review_id_fkey";

-- DropForeignKey
ALTER TABLE "feedback360_clusters_scores" DROP CONSTRAINT "feedback360_clusters_scores_user_id_fkey";

-- DropForeignKey
ALTER TABLE "feedback360_cycle_cluster_analytics" DROP CONSTRAINT "feedback360_cycle_cluster_analytics_cluster_id_fkey";

-- DropForeignKey
ALTER TABLE "feedback360_cycle_cluster_analytics" DROP CONSTRAINT "feedback360_cycle_cluster_analytics_cycle_id_fkey";

-- DropTable
DROP TABLE "feedback360_clusters_scores";

-- DropTable
DROP TABLE "feedback360_cycle_cluster_analytics";

-- CreateTable
CREATE TABLE "feedback360_cluster_scores" (
    "id" SERIAL NOT NULL,
    "cycle_id" INTEGER,
    "cluster_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "review_id" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "answers_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback360_cluster_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback360_cluster_score_analytics" (
    "id" SERIAL NOT NULL,
    "cycle_id" INTEGER NOT NULL,
    "cluster_id" INTEGER NOT NULL,
    "employees_count" INTEGER NOT NULL DEFAULT 0,
    "min_score" DOUBLE PRECISION NOT NULL,
    "max_score" DOUBLE PRECISION NOT NULL,
    "average_score" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback360_cluster_score_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "feedback360_cluster_scores_cycle_id_idx" ON "feedback360_cluster_scores"("cycle_id");

-- CreateIndex
CREATE INDEX "feedback360_cluster_scores_cluster_id_idx" ON "feedback360_cluster_scores"("cluster_id");

-- CreateIndex
CREATE INDEX "feedback360_cluster_scores_user_id_idx" ON "feedback360_cluster_scores"("user_id");

-- CreateIndex
CREATE INDEX "feedback360_cluster_scores_review_id_idx" ON "feedback360_cluster_scores"("review_id");

-- CreateIndex
CREATE UNIQUE INDEX "feedback360_cluster_scores_cluster_id_user_id_key" ON "feedback360_cluster_scores"("cluster_id", "user_id");

-- CreateIndex
CREATE INDEX "feedback360_cluster_score_analytics_cycle_id_idx" ON "feedback360_cluster_score_analytics"("cycle_id");

-- CreateIndex
CREATE INDEX "feedback360_cluster_score_analytics_cluster_id_idx" ON "feedback360_cluster_score_analytics"("cluster_id");

-- CreateIndex
CREATE UNIQUE INDEX "feedback360_cluster_score_analytics_cycle_id_cluster_id_key" ON "feedback360_cluster_score_analytics"("cycle_id", "cluster_id");

-- AddForeignKey
ALTER TABLE "feedback360_cluster_scores" ADD CONSTRAINT "feedback360_cluster_scores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_cluster_scores" ADD CONSTRAINT "feedback360_cluster_scores_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "feedback360_cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_cluster_scores" ADD CONSTRAINT "feedback360_cluster_scores_cluster_id_fkey" FOREIGN KEY ("cluster_id") REFERENCES "library_clusters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_cluster_scores" ADD CONSTRAINT "feedback360_cluster_scores_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "feedback360_reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_cluster_score_analytics" ADD CONSTRAINT "feedback360_cluster_score_analytics_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "feedback360_cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_cluster_score_analytics" ADD CONSTRAINT "feedback360_cluster_score_analytics_cluster_id_fkey" FOREIGN KEY ("cluster_id") REFERENCES "library_clusters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
