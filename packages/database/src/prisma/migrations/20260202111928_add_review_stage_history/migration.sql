-- CreateTable
CREATE TABLE "feedback360_review_stage_history" (
    "id" SERIAL NOT NULL,
    "review_id" INTEGER NOT NULL,
    "from_stage" "feedback360_review_stage" NOT NULL,
    "to_stage" "feedback360_review_stage" NOT NULL,
    "changed_by_id" INTEGER,
    "changed_by_name" VARCHAR(302),
    "reason" TEXT,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback360_review_stage_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "feedback360_review_stage_history_review_id_idx" ON "feedback360_review_stage_history"("review_id");

-- CreateIndex
CREATE INDEX "feedback360_review_stage_history_changed_by_id_idx" ON "feedback360_review_stage_history"("changed_by_id");

-- CreateIndex
CREATE INDEX "feedback360_review_stage_history_created_at_idx" ON "feedback360_review_stage_history"("created_at");

-- AddForeignKey
ALTER TABLE "feedback360_review_stage_history" ADD CONSTRAINT "feedback360_review_stage_history_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "feedback360_reviews"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedback360_review_stage_history" ADD CONSTRAINT "feedback360_review_stage_history_changed_by_id_fkey" FOREIGN KEY ("changed_by_id") REFERENCES "identity_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
