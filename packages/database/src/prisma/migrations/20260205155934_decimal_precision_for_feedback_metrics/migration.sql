/*
  Warnings:

  - You are about to alter the column `min_score` on the `feedback360_cluster_score_analytics` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `max_score` on the `feedback360_cluster_score_analytics` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `average_score` on the `feedback360_cluster_score_analytics` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `score` on the `feedback360_cluster_scores` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `lower_bound` on the `library_clusters` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `upper_bound` on the `library_clusters` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `average_by_self_assessment` on the `reporting_analytics` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `average_by_team` on the `reporting_analytics` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `average_by_other` on the `reporting_analytics` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `delta_by_team` on the `reporting_analytics` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `delta_by_other` on the `reporting_analytics` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `turnout_of_team` on the `reporting_reports` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `turnout_of_other` on the `reporting_reports` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `total_average_by_self_assessment` on the `reporting_reports` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `total_average_by_team` on the `reporting_reports` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `total_average_by_others` on the `reporting_reports` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `total_delta_by_team` on the `reporting_reports` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `total_delta_by_others` on the `reporting_reports` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `total_average_competence_by_others` on the `reporting_reports` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `total_average_competence_by_self_assessment` on the `reporting_reports` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `total_average_competence_by_team` on the `reporting_reports` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `total_competence_percentage_by_others` on the `reporting_reports` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `total_competence_percentage_by_self_assessment` on the `reporting_reports` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `total_competence_percentage_by_team` on the `reporting_reports` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.

*/
-- AlterTable
ALTER TABLE "feedback360_cluster_score_analytics" ALTER COLUMN "min_score" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "max_score" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "average_score" SET DATA TYPE DECIMAL(10,4);

-- AlterTable
ALTER TABLE "feedback360_cluster_scores" ALTER COLUMN "score" SET DATA TYPE DECIMAL(10,4);

-- AlterTable
ALTER TABLE "library_clusters" ALTER COLUMN "lower_bound" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "upper_bound" SET DATA TYPE DECIMAL(10,4);

-- AlterTable
ALTER TABLE "reporting_analytics" ALTER COLUMN "average_by_self_assessment" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "average_by_team" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "average_by_other" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "delta_by_team" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "delta_by_other" SET DATA TYPE DECIMAL(10,4);

-- AlterTable
ALTER TABLE "reporting_reports" ALTER COLUMN "turnout_of_team" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "turnout_of_other" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "total_average_by_self_assessment" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "total_average_by_team" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "total_average_by_others" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "total_delta_by_team" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "total_delta_by_others" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "total_average_competence_by_others" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "total_average_competence_by_self_assessment" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "total_average_competence_by_team" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "total_competence_percentage_by_others" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "total_competence_percentage_by_self_assessment" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "total_competence_percentage_by_team" SET DATA TYPE DECIMAL(10,4);
