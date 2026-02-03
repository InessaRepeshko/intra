/*
  Warnings:

  - Made the column `full_name` on table `identity_users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `position_id` on table `identity_users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "identity_users" ALTER COLUMN "full_name" SET NOT NULL,
ALTER COLUMN "position_id" SET NOT NULL;
