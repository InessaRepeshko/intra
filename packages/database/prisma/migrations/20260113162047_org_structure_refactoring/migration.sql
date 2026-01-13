/*
  Warnings:

  - You are about to drop the `positions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `positions_hierarchy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `team_memberships` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teams` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `feedback360` DROP FOREIGN KEY `feedback360_ibfk_5`;

-- DropForeignKey
ALTER TABLE `feedback360_questions` DROP FOREIGN KEY `feedback360_questions_ibfk_4`;

-- DropForeignKey
ALTER TABLE `positions_hierarchy` DROP FOREIGN KEY `positions_hierarchy_ibfk_1`;

-- DropForeignKey
ALTER TABLE `positions_hierarchy` DROP FOREIGN KEY `positions_hierarchy_ibfk_2`;

-- DropForeignKey
ALTER TABLE `questions_positions_relations` DROP FOREIGN KEY `questions_positions_relations_ibfk_2`;

-- DropForeignKey
ALTER TABLE `team_memberships` DROP FOREIGN KEY `team_memberships_ibfk_1`;

-- DropTable
DROP TABLE `positions`;

-- DropTable
DROP TABLE `positions_hierarchy`;

-- DropTable
DROP TABLE `team_memberships`;

-- DropTable
DROP TABLE `teams`;

-- CreateTable
CREATE TABLE `org_positions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `org_positions_hierarchy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parent_position_id` INTEGER NOT NULL,
    `child_position_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `org_idx_child_position`(`child_position_id`),
    UNIQUE INDEX `org_unique_position_hierarchy`(`parent_position_id`, `child_position_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `org_team_memberships` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `team_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `is_primary` BOOLEAN NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `org_idx_team`(`team_id`),
    INDEX `org_idx_user`(`user_id`),
    UNIQUE INDEX `org_unique_team_member`(`team_id`, `user_id`, `is_primary`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `org_teams` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `head_id` INTEGER NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `org_idx_head`(`head_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `feedback360` ADD CONSTRAINT `feedback360_ibfk_5` FOREIGN KEY (`position_id`) REFERENCES `org_positions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_questions` ADD CONSTRAINT `feedback360_questions_ibfk_4` FOREIGN KEY (`position_id`) REFERENCES `org_positions`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `org_positions_hierarchy` ADD CONSTRAINT `org_positions_hierarchy_ibfk_1` FOREIGN KEY (`parent_position_id`) REFERENCES `org_positions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `org_positions_hierarchy` ADD CONSTRAINT `org_positions_hierarchy_ibfk_2` FOREIGN KEY (`child_position_id`) REFERENCES `org_positions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `questions_positions_relations` ADD CONSTRAINT `questions_positions_relations_ibfk_2` FOREIGN KEY (`position_id`) REFERENCES `org_positions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `org_team_memberships` ADD CONSTRAINT `org_team_memberships_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `org_teams`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
