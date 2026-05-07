-- CreateEnum
CREATE TYPE "notification_kind" AS ENUM ('ratee_self_assessment', 'respondent_invitation', 'hr_report_ready', 'reviewer_report_ready');

-- CreateEnum
CREATE TYPE "notification_channel" AS ENUM ('email');

-- CreateTable
CREATE TABLE "notification_logs" (
    "id" SERIAL NOT NULL,
    "review_id" INTEGER NOT NULL,
    "kind" "notification_kind" NOT NULL,
    "channel" "notification_channel" NOT NULL DEFAULT 'email',
    "recipient_user_id" INTEGER NOT NULL,
    "recipient_email" VARCHAR(255) NOT NULL,
    "sent_at" TIMESTAMP(0),
    "error_message" TEXT,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notification_logs_review_id_idx" ON "notification_logs"("review_id");

-- CreateIndex
CREATE INDEX "notification_logs_recipient_user_id_idx" ON "notification_logs"("recipient_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "notification_logs_review_id_kind_recipient_user_id_key" ON "notification_logs"("review_id", "kind", "recipient_user_id");

-- AddForeignKey
ALTER TABLE "notification_logs" ADD CONSTRAINT "notification_logs_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "feedback360_reviews"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
