/*
  Warnings:

  - You are about to drop the column `delta_by_self_assessment` on the `reporting_analytics` table. All the data in the column will be lost.
  - You are about to drop the column `total_delta_by_self_assessment` on the `reporting_reports` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reporting_analytics" DROP COLUMN "delta_by_self_assessment";

-- AlterTable
ALTER TABLE "reporting_reports" DROP COLUMN "total_delta_by_self_assessment";
