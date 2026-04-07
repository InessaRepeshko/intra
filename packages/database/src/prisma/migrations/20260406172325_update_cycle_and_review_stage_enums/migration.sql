/*
  Warnings:

  - The values [verification_by_hr,verification_by_user,rejected] on the enum `feedback360_review_stage` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "feedback360_cycle_stage" ADD VALUE 'preparing_report';
ALTER TYPE "feedback360_cycle_stage" ADD VALUE 'published';

-- AlterEnum
BEGIN;
CREATE TYPE "feedback360_review_stage_new" AS ENUM ('new', 'self_assessment', 'waiting_to_start', 'in_progress', 'finished', 'preparing_report', 'processing_by_hr', 'published', 'analysis', 'canceled', 'archived');
ALTER TABLE "public"."feedback360_reviews" ALTER COLUMN "stage" DROP DEFAULT;
ALTER TABLE "feedback360_reviews" ALTER COLUMN "stage" TYPE "feedback360_review_stage_new" USING ("stage"::text::"feedback360_review_stage_new");
ALTER TABLE "feedback360_review_stage_history" ALTER COLUMN "from_stage" TYPE "feedback360_review_stage_new" USING ("from_stage"::text::"feedback360_review_stage_new");
ALTER TABLE "feedback360_review_stage_history" ALTER COLUMN "to_stage" TYPE "feedback360_review_stage_new" USING ("to_stage"::text::"feedback360_review_stage_new");
ALTER TYPE "feedback360_review_stage" RENAME TO "feedback360_review_stage_old";
ALTER TYPE "feedback360_review_stage_new" RENAME TO "feedback360_review_stage";
DROP TYPE "public"."feedback360_review_stage_old";
ALTER TABLE "feedback360_reviews" ALTER COLUMN "stage" SET DEFAULT 'new';
COMMIT;

-- AlterTable
ALTER TABLE "feedback360_reviews" ALTER COLUMN "stage" SET DEFAULT 'new';
