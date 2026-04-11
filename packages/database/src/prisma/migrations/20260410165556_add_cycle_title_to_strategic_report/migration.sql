/*
  Warnings:

  - Added the required column `cycle_title` to the `reporting_strategic_reports` table without a default value. This is not possible if the table is not empty.
  - Made the column `cycle_id` on table `reporting_strategic_reports` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "reporting_strategic_reports" ADD COLUMN     "cycle_title" TEXT NOT NULL,
ALTER COLUMN "cycle_id" SET NOT NULL;
