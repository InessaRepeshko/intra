/*
  Warnings:

  - The values [research] on the enum `feedback360_review_stage` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "feedback360_review_stage_new" AS ENUM ('canceled', 'verification_by_hr', 'verification_by_user', 'rejected', 'self_assessment', 'waiting_to_start', 'in_progress', 'preparing_report', 'processing_by_hr', 'published', 'analysis', 'finished');
ALTER TABLE "public"."feedback360_reviews" ALTER COLUMN "stage" DROP DEFAULT;
ALTER TABLE "feedback360_reviews" ALTER COLUMN "stage" TYPE "feedback360_review_stage_new" USING ("stage"::text::"feedback360_review_stage_new");
ALTER TYPE "feedback360_review_stage" RENAME TO "feedback360_review_stage_old";
ALTER TYPE "feedback360_review_stage_new" RENAME TO "feedback360_review_stage";
DROP TYPE "public"."feedback360_review_stage_old";
ALTER TABLE "feedback360_reviews" ALTER COLUMN "stage" SET DEFAULT 'verification_by_hr';
COMMIT;
