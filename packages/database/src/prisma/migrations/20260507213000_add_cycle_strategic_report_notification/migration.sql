-- AlterEnum
ALTER TYPE "notification_kind" ADD VALUE 'cycle_strategic_report_ready';

-- DropForeignKey
ALTER TABLE "notification_logs" DROP CONSTRAINT "notification_logs_review_id_fkey";

-- AlterTable
ALTER TABLE "notification_logs" ALTER COLUMN "review_id" DROP NOT NULL,
                                ADD COLUMN "cycle_id" INTEGER;

-- CreateIndex
CREATE INDEX "notification_logs_cycle_id_idx" ON "notification_logs"("cycle_id");

-- CreateIndex
CREATE UNIQUE INDEX "notification_logs_cycle_id_kind_recipient_user_id_key" ON "notification_logs"("cycle_id", "kind", "recipient_user_id");

-- AddForeignKey
ALTER TABLE "notification_logs" ADD CONSTRAINT "notification_logs_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "feedback360_reviews"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notification_logs" ADD CONSTRAINT "notification_logs_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "feedback360_cycles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
