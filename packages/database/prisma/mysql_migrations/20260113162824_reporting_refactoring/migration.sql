/*
  Warnings:

  - You are about to drop the `feedback360_reports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reports_analytics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reports_comments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `feedback360_reports` DROP FOREIGN KEY `feedback360_reports_ibfk_cycle`;

-- DropForeignKey
ALTER TABLE `feedback360_reports` DROP FOREIGN KEY `feedback360_reports_ibfk_feedback360`;

-- DropForeignKey
ALTER TABLE `reports_analytics` DROP FOREIGN KEY `reports_analytics_ibfk_1`;

-- DropForeignKey
ALTER TABLE `reports_comments` DROP FOREIGN KEY `reports_comments_ibfk_1`;

-- DropTable
DROP TABLE `feedback360_reports`;

-- DropTable
DROP TABLE `reports_analytics`;

-- DropTable
DROP TABLE `reports_comments`;

-- CreateTable
CREATE TABLE `reporting_feedback360_reports` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `feedback360_id` INTEGER NOT NULL,
    `cycle_id` INTEGER NULL,
    `turnout_of_team` DOUBLE NULL,
    `turnout_of_other` DOUBLE NULL,
    `total_average_by_self_assessment` DOUBLE NULL,
    `total_average_by_team` DOUBLE NULL,
    `total_average_by_others` DOUBLE NULL,
    `total_delta_by_self_assessment` DOUBLE NULL,
    `total_delta_by_team` DOUBLE NULL,
    `total_delta_by_others` DOUBLE NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `reporting_feedback360_reports_unique_feedback360`(`feedback360_id`),
    INDEX `reporting_feedback360_reports_idx_cycle`(`cycle_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reporting_report_analytics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `report_id` INTEGER NOT NULL,
    `entity_type` ENUM('question', 'competence') NOT NULL,
    `entity_id` INTEGER NULL,
    `entity_title` TEXT NOT NULL,
    `average_by_self_assessment` DOUBLE NULL,
    `average_by_team` DOUBLE NULL,
    `average_by_other` DOUBLE NULL,
    `delta_by_self_assessment` DOUBLE NULL,
    `delta_by_team` DOUBLE NULL,
    `delta_by_other` DOUBLE NULL,
    `dimension` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `reporting_report_analytics_idx_report`(`report_id`),
    UNIQUE INDEX `reporting_unique_report_entity`(`report_id`, `entity_type`, `entity_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reporting_report_comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `report_id` INTEGER NOT NULL,
    `comment` TEXT NULL,
    `comment_sentiment` ENUM('negative', 'positive') NOT NULL DEFAULT 'positive',
    `number_of_mentions` INTEGER NULL,
    `respondent_category` ENUM('self_assessment', 'team', 'other') NOT NULL,
    `author_id` INTEGER NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `reporting_report_comments_idx_report`(`report_id`),
    INDEX `reporting_report_comments_idx_author`(`author_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reporting_feedback360_reports` ADD CONSTRAINT `reporting_feedback360_reports_ibfk_feedback360` FOREIGN KEY (`feedback360_id`) REFERENCES `feedback360_feedbacks`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reporting_feedback360_reports` ADD CONSTRAINT `reporting_feedback360_reports_ibfk_cycle` FOREIGN KEY (`cycle_id`) REFERENCES `feedback360_cycles`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reporting_report_analytics` ADD CONSTRAINT `reporting_report_analytics_ibfk_report` FOREIGN KEY (`report_id`) REFERENCES `reporting_feedback360_reports`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reporting_report_comments` ADD CONSTRAINT `reporting_report_comments_ibfk_report` FOREIGN KEY (`report_id`) REFERENCES `reporting_feedback360_reports`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
