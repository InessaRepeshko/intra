-- AlterTable
ALTER TABLE "feedback360_answers" ADD COLUMN     "respondent_id" INTEGER;

-- AlterTable
ALTER TABLE "feedback360_clusters_scores" ADD COLUMN     "evaluators_count" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "feedback360_answers_respondent_id_idx" ON "feedback360_answers"("respondent_id");

-- AddForeignKey
ALTER TABLE "feedback360_answers" ADD CONSTRAINT "feedback360_answers_respondent_id_fkey" FOREIGN KEY ("respondent_id") REFERENCES "identity_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
