/*
  Warnings:

  - You are about to alter the column `first_name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(128)` to `VarChar(100)`.
  - You are about to alter the column `second_name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(128)` to `VarChar(100)`.
  - You are about to alter the column `last_name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(128)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `feedback360_questions_relations` MODIFY `question_title` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `questions` MODIFY `title` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `reports_analytics` MODIFY `entity_title` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `teams` MODIFY `head_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `first_name` VARCHAR(100) NOT NULL,
    MODIFY `second_name` VARCHAR(100) NULL,
    MODIFY `last_name` VARCHAR(100) NOT NULL,
    MODIFY `full_name` VARCHAR(302) NULL,
    MODIFY `email` VARCHAR(100) NOT NULL,
    MODIFY `head_id` INTEGER NULL;
