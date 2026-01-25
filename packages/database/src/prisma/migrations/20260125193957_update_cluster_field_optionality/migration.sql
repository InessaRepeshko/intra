/*
  Warnings:

  - Made the column `min_score` on table `feedback360_cycle_cluster_analytics` required. This step will fail if there are existing NULL values in that column.
  - Made the column `max_score` on table `feedback360_cycle_cluster_analytics` required. This step will fail if there are existing NULL values in that column.
  - Made the column `average_score` on table `feedback360_cycle_cluster_analytics` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `library_clusters` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `library_clusters` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "feedback360_cycle_cluster_analytics" ALTER COLUMN "min_score" SET NOT NULL,
ALTER COLUMN "max_score" SET NOT NULL,
ALTER COLUMN "average_score" SET NOT NULL;

-- AlterTable
ALTER TABLE "library_clusters" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "title" SET NOT NULL;
