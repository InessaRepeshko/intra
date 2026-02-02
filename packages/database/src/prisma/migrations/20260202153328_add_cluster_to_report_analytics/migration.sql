-- AlterEnum
ALTER TYPE "reporting_entity_type" ADD VALUE 'cluster';

-- AlterTable
ALTER TABLE "reporting_analytics" ADD COLUMN     "cluster_id" INTEGER,
ADD COLUMN     "cluster_title" TEXT;

-- CreateIndex
CREATE INDEX "reporting_analytics_cluster_id_idx" ON "reporting_analytics"("cluster_id");

-- AddForeignKey
ALTER TABLE "reporting_analytics" ADD CONSTRAINT "reporting_analytics_cluster_id_fkey" FOREIGN KEY ("cluster_id") REFERENCES "library_clusters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
