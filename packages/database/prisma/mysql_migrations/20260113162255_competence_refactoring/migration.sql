/*
  Warnings:

  - You are about to drop the `competences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `competences_clusters` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `questions_positions_relations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `clusters_users_relations` DROP FOREIGN KEY `clusters_users_relations_ibfk_2`;

-- DropForeignKey
ALTER TABLE `competences_clusters` DROP FOREIGN KEY `competences_clusters_ibfk_1`;

-- DropForeignKey
ALTER TABLE `competences_clusters` DROP FOREIGN KEY `competences_clusters_ibfk_2`;

-- DropForeignKey
ALTER TABLE `feedback360_answers` DROP FOREIGN KEY `feedback360_answers_ibfk_1`;

-- DropForeignKey
ALTER TABLE `feedback360_questions` DROP FOREIGN KEY `feedback360_questions_ibfk_2`;

-- DropForeignKey
ALTER TABLE `feedback360_questions` DROP FOREIGN KEY `feedback360_questions_ibfk_3`;

-- DropForeignKey
ALTER TABLE `feedback360_questions_relations` DROP FOREIGN KEY `feedback360_questions_relations_ibfk_2`;

-- DropForeignKey
ALTER TABLE `questions` DROP FOREIGN KEY `questions_ibfk_1`;

-- DropForeignKey
ALTER TABLE `questions_positions_relations` DROP FOREIGN KEY `questions_positions_relations_ibfk_1`;

-- DropForeignKey
ALTER TABLE `questions_positions_relations` DROP FOREIGN KEY `questions_positions_relations_ibfk_2`;

-- DropTable
DROP TABLE `competences`;

-- DropTable
DROP TABLE `competences_clusters`;

-- DropTable
DROP TABLE `questions`;

-- DropTable
DROP TABLE `questions_positions_relations`;

-- CreateTable
CREATE TABLE `competence_competences` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(100) NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `competence_unique_competence_code`(`code`),
    UNIQUE INDEX `competence_unique_competence_title`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `competence_clusters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cycle_id` INTEGER NULL,
    `competence_id` INTEGER NOT NULL,
    `lower_bound` DOUBLE NOT NULL,
    `upper_bound` DOUBLE NOT NULL,
    `min_score` DOUBLE NOT NULL,
    `max_score` DOUBLE NOT NULL,
    `average_score` DOUBLE NOT NULL,
    `employees_count` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `competence_idx_competence`(`competence_id`),
    INDEX `competence_idx_cycle`(`cycle_id`),
    UNIQUE INDEX `competence_unique_competence_cluster`(`cycle_id`, `competence_id`, `lower_bound`, `upper_bound`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `competence_questions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` TEXT NOT NULL,
    `answer_type` ENUM('numerical_scale', 'text_field') NOT NULL,
    `competence_id` INTEGER NOT NULL,
    `is_for_selfassessment` BOOLEAN NULL DEFAULT false,
    `question_status` ENUM('archive', 'active') NOT NULL DEFAULT 'active',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `competence_idx_competence`(`competence_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `competence_question_positions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question_id` INTEGER NOT NULL,
    `position_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `competence_position_id`(`position_id`),
    UNIQUE INDEX `competence_unique_relation`(`question_id`, `position_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `clusters_users_relations` ADD CONSTRAINT `clusters_users_relations_ibfk_2` FOREIGN KEY (`cluster_id`) REFERENCES `competence_clusters`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `competence_clusters` ADD CONSTRAINT `competence_clusters_ibfk_1` FOREIGN KEY (`cycle_id`) REFERENCES `feedback360_cycles`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `competence_clusters` ADD CONSTRAINT `competence_clusters_ibfk_2` FOREIGN KEY (`competence_id`) REFERENCES `competence_competences`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_answers` ADD CONSTRAINT `feedback360_answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `competence_questions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_questions` ADD CONSTRAINT `feedback360_questions_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `competence_questions`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_questions` ADD CONSTRAINT `feedback360_questions_ibfk_3` FOREIGN KEY (`competence_id`) REFERENCES `competence_competences`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_questions_relations` ADD CONSTRAINT `feedback360_questions_relations_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `competence_questions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `competence_questions` ADD CONSTRAINT `competence_questions_ibfk_1` FOREIGN KEY (`competence_id`) REFERENCES `competence_competences`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `competence_question_positions` ADD CONSTRAINT `competence_question_positions_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `competence_questions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `competence_question_positions` ADD CONSTRAINT `competence_question_positions_ibfk_2` FOREIGN KEY (`position_id`) REFERENCES `org_positions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
