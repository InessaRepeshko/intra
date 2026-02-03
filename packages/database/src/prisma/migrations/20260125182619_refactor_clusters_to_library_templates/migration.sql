/*
  Warnings:

  - You are about to drop the column `average_score` on the `library_clusters` table. All the data in the column will be lost.
  - You are about to drop the column `cycle_id` on the `library_clusters` table. All the data in the column will be lost.
  - You are about to drop the column `employees_count` on the `library_clusters` table. All the data in the column will be lost.
  - You are about to drop the column `max_score` on the `library_clusters` table. All the data in the column will be lost.
  - You are about to drop the column `min_score` on the `library_clusters` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[competence_id,lower_bound,upper_bound]` on the table `library_clusters` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "library_clusters" DROP CONSTRAINT "library_clusters_cycle_id_fkey";

-- DropIndex
DROP INDEX "library_clusters_cycle_id_competence_id_lower_bound_upper_b_key";

-- DropIndex
DROP INDEX "library_clusters_cycle_id_idx";

-- AlterTable
ALTER TABLE "library_clusters" DROP COLUMN "average_score",
DROP COLUMN "cycle_id",
DROP COLUMN "employees_count",
DROP COLUMN "max_score",
DROP COLUMN "min_score",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" VARCHAR(255);

-- CreateTable
CREATE TABLE "feedback360_cycle_cluster_analytics" (
    "id" SERIAL NOT NULL,
    "cycle_id" INTEGER NOT NULL,
    "cluster_id" INTEGER NOT NULL,
    "employees_count" INTEGER NOT NULL DEFAULT 0,
    "min_score" DOUBLE PRECISION,
    "max_score" DOUBLE PRECISION,
    "average_score" DOUBLE PRECISION,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback360_cycle_cluster_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "feedback360_cycle_cluster_analytics_cycle_id_idx" ON "feedback360_cycle_cluster_analytics"("cycle_id");

-- CreateIndex
CREATE INDEX "feedback360_cycle_cluster_analytics_cluster_id_idx" ON "feedback360_cycle_cluster_analytics"("cluster_id");

-- CreateIndex
CREATE UNIQUE INDEX "feedback360_cycle_cluster_analytics_cycle_id_cluster_id_key" ON "feedback360_cycle_cluster_analytics"("cycle_id", "cluster_id");

-- CreateIndex
CREATE UNIQUE INDEX "library_clusters_competence_id_lower_bound_upper_bound_key" ON "library_clusters"("competence_id", "lower_bound", "upper_bound");

-- AddForeignKey
ALTER TABLE "feedback360_cycle_cluster_analytics" ADD CONSTRAINT "feedback360_cycle_cluster_analytics_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "feedback360_cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_cycle_cluster_analytics" ADD CONSTRAINT "feedback360_cycle_cluster_analytics_cluster_id_fkey" FOREIGN KEY ("cluster_id") REFERENCES "library_clusters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
