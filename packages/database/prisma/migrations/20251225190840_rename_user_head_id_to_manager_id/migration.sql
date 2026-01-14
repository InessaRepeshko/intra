/*
  Warnings:

  - You are about to drop the column `head_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_ibfk_1`;

-- DropIndex
DROP INDEX `idx_head` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `head_id`,
    ADD COLUMN `manager_id` INTEGER NULL;

-- CreateIndex
CREATE INDEX `idx_manager` ON `users`(`manager_id`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
