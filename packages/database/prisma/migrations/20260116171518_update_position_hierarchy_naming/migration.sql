/*
  Warnings:

  - You are about to drop the column `child_position_id` on the `org_positions_hierarchy` table. All the data in the column will be lost.
  - You are about to drop the column `parent_position_id` on the `org_positions_hierarchy` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[superior_position_id,subordinate_position_id]` on the table `org_positions_hierarchy` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subordinate_position_id` to the `org_positions_hierarchy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `superior_position_id` to the `org_positions_hierarchy` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "org_positions_hierarchy" DROP CONSTRAINT "org_positions_hierarchy_ibfk_1";

-- DropForeignKey
ALTER TABLE "org_positions_hierarchy" DROP CONSTRAINT "org_positions_hierarchy_ibfk_2";

-- DropIndex
DROP INDEX "org_idx_child_position";

-- DropIndex
DROP INDEX "org_unique_position_hierarchy";

-- AlterTable
ALTER TABLE "org_positions_hierarchy" DROP COLUMN "child_position_id",
DROP COLUMN "parent_position_id",
ADD COLUMN     "subordinate_position_id" INTEGER NOT NULL,
ADD COLUMN     "superior_position_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "org_idx_subordinate_position" ON "org_positions_hierarchy"("subordinate_position_id");

-- CreateIndex
CREATE UNIQUE INDEX "org_unique_position_hierarchy" ON "org_positions_hierarchy"("superior_position_id", "subordinate_position_id");

-- AddForeignKey
ALTER TABLE "org_positions_hierarchy" ADD CONSTRAINT "org_positions_hierarchy_ibfk_1" FOREIGN KEY ("superior_position_id") REFERENCES "org_positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "org_positions_hierarchy" ADD CONSTRAINT "org_positions_hierarchy_ibfk_2" FOREIGN KEY ("subordinate_position_id") REFERENCES "org_positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
