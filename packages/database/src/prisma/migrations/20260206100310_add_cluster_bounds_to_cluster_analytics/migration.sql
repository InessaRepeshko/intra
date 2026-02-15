/*
  Warnings:

  - You are about to drop the column `user_id` on the `feedback360_cluster_scores` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cluster_id,ratee_id]` on the table `feedback360_cluster_scores` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lower_bound` to the `feedback360_cluster_score_analytics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `upper_bound` to the `feedback360_cluster_score_analytics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratee_id` to the `feedback360_cluster_scores` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "feedback360_cluster_scores" DROP CONSTRAINT "feedback360_cluster_scores_user_id_fkey";

-- DropIndex
DROP INDEX "feedback360_cluster_scores_cluster_id_user_id_key";

-- DropIndex
DROP INDEX "feedback360_cluster_scores_user_id_idx";

-- AlterTable
ALTER TABLE "feedback360_cluster_score_analytics" ADD COLUMN     "lower_bound" DECIMAL(10,4) NOT NULL,
ADD COLUMN     "upper_bound" DECIMAL(10,4) NOT NULL;

-- AlterTable
ALTER TABLE "feedback360_cluster_scores" DROP COLUMN "user_id",
ADD COLUMN     "ratee_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "feedback360_cluster_scores_ratee_id_idx" ON "feedback360_cluster_scores"("ratee_id");

-- CreateIndex
CREATE UNIQUE INDEX "feedback360_cluster_scores_cluster_id_ratee_id_key" ON "feedback360_cluster_scores"("cluster_id", "ratee_id");

-- AddForeignKey
ALTER TABLE "feedback360_cluster_scores" ADD CONSTRAINT "feedback360_cluster_scores_ratee_id_fkey" FOREIGN KEY ("ratee_id") REFERENCES "identity_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
