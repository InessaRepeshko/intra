/*
  Warnings:

  - Made the column `employees_density` on table `feedback360_cluster_score_analytics` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "feedback360_cluster_score_analytics" ALTER COLUMN "employees_density" SET NOT NULL;
