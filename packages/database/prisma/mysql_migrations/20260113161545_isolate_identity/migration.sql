/*
  Warnings:

  - You are about to drop the column `report_id` on the `feedback360` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `competences` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `clusters_users_relations` DROP FOREIGN KEY `clusters_users_relations_ibfk_3`;

-- DropForeignKey
ALTER TABLE `feedback360` DROP FOREIGN KEY `feedback360_ibfk_1`;

-- DropForeignKey
ALTER TABLE `feedback360` DROP FOREIGN KEY `feedback360_ibfk_3`;

-- DropForeignKey
ALTER TABLE `feedback360` DROP FOREIGN KEY `feedback360_ibfk_4`;

-- DropForeignKey
ALTER TABLE `feedback360_cycles` DROP FOREIGN KEY `feedback360_cycles_ibfk_1`;

-- DropForeignKey
ALTER TABLE `feedback360_respondents_relations` DROP FOREIGN KEY `feedback360_respondents_relations_ibfk_2`;

-- DropForeignKey
ALTER TABLE `feedback360_reviewers_relations` DROP FOREIGN KEY `feedback360_reviewers_relations_ibfk_2`;

-- DropForeignKey
ALTER TABLE `teams` DROP FOREIGN KEY `teams_ibfk_1`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_ibfk_2`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_ibfk_3`;

-- DropIndex
DROP INDEX `idx_report_id` ON `feedback360`;

-- AlterTable
ALTER TABLE `clusters_users_relations` ADD COLUMN `feedback360_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `competences` ADD COLUMN `code` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `feedback360` DROP COLUMN `report_id`;

-- AlterTable
ALTER TABLE `feedback360_answers` ADD COLUMN `feedback360_question_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `feedback360_respondents_relations` ADD COLUMN `invited_at` TIMESTAMP(0) NULL,
    ADD COLUMN `responded_at` TIMESTAMP(0) NULL;

-- AlterTable
ALTER TABLE `reports_analytics` ADD COLUMN `dimension` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `reports_comments` ADD COLUMN `author_id` INTEGER NULL,
    ADD COLUMN `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `users` MODIFY `position_id` INTEGER NULL,
    MODIFY `team_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` ENUM('admin', 'hr', 'manager', 'employee') NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `unique_role_code`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `role_code` ENUM('admin', 'hr', 'manager', 'employee') NOT NULL,
    `assigned_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_role_code`(`role_code`),
    INDEX `idx_user_id`(`user_id`),
    UNIQUE INDEX `unique_user_role`(`user_id`, `role_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feedback360_questions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cycle_id` INTEGER NULL,
    `question_id` INTEGER NULL,
    `title` TEXT NOT NULL,
    `answer_type` ENUM('numerical_scale', 'text_field') NOT NULL,
    `competence_id` INTEGER NULL,
    `position_id` INTEGER NULL,
    `is_for_selfassessment` BOOLEAN NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_cycle`(`cycle_id`),
    INDEX `idx_question`(`question_id`),
    INDEX `idx_competence`(`competence_id`),
    INDEX `idx_position`(`position_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `positions_hierarchy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parent_position_id` INTEGER NOT NULL,
    `child_position_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_child_position`(`child_position_id`),
    UNIQUE INDEX `unique_position_hierarchy`(`parent_position_id`, `child_position_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team_memberships` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `team_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `is_primary` BOOLEAN NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_team`(`team_id`),
    INDEX `idx_user`(`user_id`),
    UNIQUE INDEX `unique_team_member`(`team_id`, `user_id`, `is_primary`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `idx_feedback360` ON `clusters_users_relations`(`feedback360_id`);

-- CreateIndex
CREATE UNIQUE INDEX `unique_competence_code` ON `competences`(`code`);

-- CreateIndex
CREATE INDEX `idx_feedback360_question` ON `feedback360_answers`(`feedback360_question_id`);

-- CreateIndex
CREATE INDEX `idx_author` ON `reports_comments`(`author_id`);

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_code`) REFERENCES `roles`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `clusters_users_relations` ADD CONSTRAINT `clusters_users_relations_ibfk_4` FOREIGN KEY (`feedback360_id`) REFERENCES `feedback360`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_answers` ADD CONSTRAINT `feedback360_answers_ibfk_3` FOREIGN KEY (`feedback360_question_id`) REFERENCES `feedback360_questions`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_questions` ADD CONSTRAINT `feedback360_questions_ibfk_1` FOREIGN KEY (`cycle_id`) REFERENCES `feedback360_cycles`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_questions` ADD CONSTRAINT `feedback360_questions_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_questions` ADD CONSTRAINT `feedback360_questions_ibfk_3` FOREIGN KEY (`competence_id`) REFERENCES `competences`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_questions` ADD CONSTRAINT `feedback360_questions_ibfk_4` FOREIGN KEY (`position_id`) REFERENCES `positions`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `positions_hierarchy` ADD CONSTRAINT `positions_hierarchy_ibfk_1` FOREIGN KEY (`parent_position_id`) REFERENCES `positions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `positions_hierarchy` ADD CONSTRAINT `positions_hierarchy_ibfk_2` FOREIGN KEY (`child_position_id`) REFERENCES `positions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `team_memberships` ADD CONSTRAINT `team_memberships_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
