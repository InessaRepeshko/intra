/*
  Warnings:

  - You are about to drop the `clusters_users_relations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `feedback360` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `clusters_users_relations` DROP FOREIGN KEY `clusters_users_relations_ibfk_1`;

-- DropForeignKey
ALTER TABLE `clusters_users_relations` DROP FOREIGN KEY `clusters_users_relations_ibfk_2`;

-- DropForeignKey
ALTER TABLE `clusters_users_relations` DROP FOREIGN KEY `clusters_users_relations_ibfk_4`;

-- DropForeignKey
ALTER TABLE `feedback360` DROP FOREIGN KEY `feedback360_ibfk_2`;

-- DropForeignKey
ALTER TABLE `feedback360` DROP FOREIGN KEY `feedback360_ibfk_5`;

-- DropForeignKey
ALTER TABLE `feedback360_answers` DROP FOREIGN KEY `feedback360_answers_ibfk_1`;

-- DropForeignKey
ALTER TABLE `feedback360_answers` DROP FOREIGN KEY `feedback360_answers_ibfk_2`;

-- DropForeignKey
ALTER TABLE `feedback360_answers` DROP FOREIGN KEY `feedback360_answers_ibfk_3`;

-- DropForeignKey
ALTER TABLE `feedback360_questions` DROP FOREIGN KEY `feedback360_questions_ibfk_1`;

-- DropForeignKey
ALTER TABLE `feedback360_questions` DROP FOREIGN KEY `feedback360_questions_ibfk_2`;

-- DropForeignKey
ALTER TABLE `feedback360_questions` DROP FOREIGN KEY `feedback360_questions_ibfk_3`;

-- DropForeignKey
ALTER TABLE `feedback360_questions` DROP FOREIGN KEY `feedback360_questions_ibfk_4`;

-- DropForeignKey
ALTER TABLE `feedback360_questions_relations` DROP FOREIGN KEY `feedback360_questions_relations_ibfk_1`;

-- DropForeignKey
ALTER TABLE `feedback360_questions_relations` DROP FOREIGN KEY `feedback360_questions_relations_ibfk_2`;

-- DropForeignKey
ALTER TABLE `feedback360_reports` DROP FOREIGN KEY `feedback360_reports_ibfk_1`;

-- DropForeignKey
ALTER TABLE `feedback360_reports` DROP FOREIGN KEY `feedback360_reports_ibfk_2`;

-- DropForeignKey
ALTER TABLE `feedback360_respondents_relations` DROP FOREIGN KEY `feedback360_respondents_relations_ibfk_1`;

-- DropForeignKey
ALTER TABLE `feedback360_reviewers_relations` DROP FOREIGN KEY `feedback360_reviewers_relations_ibfk_1`;

-- DropTable
DROP TABLE `clusters_users_relations`;

-- DropTable
DROP TABLE `feedback360`;

-- CreateTable
CREATE TABLE `feedback360_cluster_scores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cycle_id` INTEGER NULL,
    `cluster_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `feedback360_id` INTEGER NULL,
    `score` DOUBLE NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `feedback360_idx_cycle`(`cycle_id`),
    INDEX `feedback360_idx_cluster`(`cluster_id`),
    INDEX `feedback360_idx_user`(`user_id`),
    INDEX `feedback360_idx_feedback360`(`feedback360_id`),
    UNIQUE INDEX `feedback360_unique_cluster_member`(`cluster_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feedback360_feedbacks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ratee_id` INTEGER NOT NULL,
    `ratee_note` TEXT NULL,
    `position_id` INTEGER NOT NULL,
    `hr_id` INTEGER NOT NULL,
    `hr_note` TEXT NULL,
    `cycle_id` INTEGER NULL,
    `stage` ENUM('canceled', 'verification_by_hr', 'verification_by_user', 'rejected', 'self_assessment', 'waiting_to_start', 'in_progress', 'research', 'finished') NOT NULL DEFAULT 'verification_by_hr',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `feedback360_feedbacks_idx_cycle`(`cycle_id`),
    INDEX `feedback360_feedbacks_idx_hr`(`hr_id`),
    INDEX `feedback360_feedbacks_idx_position`(`position_id`),
    INDEX `feedback360_feedbacks_idx_ratee`(`ratee_id`),
    INDEX `feedback360_feedbacks_idx_stage`(`stage`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `feedback360_cluster_scores` ADD CONSTRAINT `feedback360_cluster_scores_ibfk_cycle` FOREIGN KEY (`cycle_id`) REFERENCES `feedback360_cycles`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_cluster_scores` ADD CONSTRAINT `feedback360_cluster_scores_ibfk_cluster` FOREIGN KEY (`cluster_id`) REFERENCES `competence_clusters`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_cluster_scores` ADD CONSTRAINT `feedback360_cluster_scores_ibfk_feedback360` FOREIGN KEY (`feedback360_id`) REFERENCES `feedback360_feedbacks`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_feedbacks` ADD CONSTRAINT `feedback360_feedbacks_ibfk_cycle` FOREIGN KEY (`cycle_id`) REFERENCES `feedback360_cycles`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_feedbacks` ADD CONSTRAINT `feedback360_feedbacks_ibfk_position` FOREIGN KEY (`position_id`) REFERENCES `org_positions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_answers` ADD CONSTRAINT `feedback360_answers_ibfk_question` FOREIGN KEY (`question_id`) REFERENCES `competence_questions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_answers` ADD CONSTRAINT `feedback360_answers_ibfk_feedback360_question` FOREIGN KEY (`feedback360_question_id`) REFERENCES `feedback360_questions`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_answers` ADD CONSTRAINT `feedback360_answers_ibfk_feedback360` FOREIGN KEY (`feedback360_id`) REFERENCES `feedback360_feedbacks`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_questions` ADD CONSTRAINT `feedback360_questions_ibfk_cycle` FOREIGN KEY (`cycle_id`) REFERENCES `feedback360_cycles`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_questions` ADD CONSTRAINT `feedback360_questions_ibfk_question` FOREIGN KEY (`question_id`) REFERENCES `competence_questions`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_questions` ADD CONSTRAINT `feedback360_questions_ibfk_competence` FOREIGN KEY (`competence_id`) REFERENCES `competence_competences`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_questions` ADD CONSTRAINT `feedback360_questions_ibfk_position` FOREIGN KEY (`position_id`) REFERENCES `org_positions`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_questions_relations` ADD CONSTRAINT `feedback360_questions_relations_ibfk_feedback360` FOREIGN KEY (`feedback360_id`) REFERENCES `feedback360_feedbacks`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_questions_relations` ADD CONSTRAINT `feedback360_questions_relations_ibfk_question` FOREIGN KEY (`question_id`) REFERENCES `competence_questions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_reports` ADD CONSTRAINT `feedback360_reports_ibfk_feedback360` FOREIGN KEY (`feedback360_id`) REFERENCES `feedback360_feedbacks`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_reports` ADD CONSTRAINT `feedback360_reports_ibfk_cycle` FOREIGN KEY (`cycle_id`) REFERENCES `feedback360_cycles`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_respondents_relations` ADD CONSTRAINT `feedback360_respondents_relations_ibfk_feedback360` FOREIGN KEY (`feedback360_id`) REFERENCES `feedback360_feedbacks`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_reviewers_relations` ADD CONSTRAINT `feedback360_reviewers_relations_ibfk_feedback360` FOREIGN KEY (`feedback360_id`) REFERENCES `feedback360_feedbacks`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- RenameIndex
ALTER TABLE `feedback360_answers` RENAME INDEX `idx_feedback360` TO `feedback360_answers_idx_feedback360`;

-- RenameIndex
ALTER TABLE `feedback360_answers` RENAME INDEX `idx_feedback360_question` TO `feedback360_answers_idx_feedback360_question`;

-- RenameIndex
ALTER TABLE `feedback360_answers` RENAME INDEX `idx_question` TO `feedback360_answers_idx_question`;

-- RenameIndex
ALTER TABLE `feedback360_cycles` RENAME INDEX `idx_hr` TO `feedback360_cycles_idx_hr`;

-- RenameIndex
ALTER TABLE `feedback360_cycles` RENAME INDEX `idx_stage` TO `feedback360_cycles_idx_stage`;

-- RenameIndex
ALTER TABLE `feedback360_questions` RENAME INDEX `idx_competence` TO `feedback360_questions_idx_competence`;

-- RenameIndex
ALTER TABLE `feedback360_questions` RENAME INDEX `idx_cycle` TO `feedback360_questions_idx_cycle`;

-- RenameIndex
ALTER TABLE `feedback360_questions` RENAME INDEX `idx_position` TO `feedback360_questions_idx_position`;

-- RenameIndex
ALTER TABLE `feedback360_questions` RENAME INDEX `idx_question` TO `feedback360_questions_idx_question`;

-- RenameIndex
ALTER TABLE `feedback360_questions_relations` RENAME INDEX `idx_feedback360` TO `feedback360_questions_relations_idx_feedback360`;

-- RenameIndex
ALTER TABLE `feedback360_questions_relations` RENAME INDEX `idx_question_id` TO `feedback360_questions_relations_idx_question_id`;

-- RenameIndex
ALTER TABLE `feedback360_questions_relations` RENAME INDEX `unique_feedback_template` TO `feedback360_unique_feedback_template`;

-- RenameIndex
ALTER TABLE `feedback360_reports` RENAME INDEX `idx_cycle` TO `feedback360_reports_idx_cycle`;

-- RenameIndex
ALTER TABLE `feedback360_reports` RENAME INDEX `unique_feedback360` TO `feedback360_reports_unique_feedback360`;

-- RenameIndex
ALTER TABLE `feedback360_respondents_relations` RENAME INDEX `idx_feedback360` TO `feedback360_respondents_idx_feedback360`;

-- RenameIndex
ALTER TABLE `feedback360_respondents_relations` RENAME INDEX `idx_feedback360_status` TO `feedback360_respondents_idx_feedback360_status`;

-- RenameIndex
ALTER TABLE `feedback360_respondents_relations` RENAME INDEX `idx_respondent` TO `feedback360_respondents_idx_respondent`;

-- RenameIndex
ALTER TABLE `feedback360_respondents_relations` RENAME INDEX `idx_respondent_feedback360_status` TO `feedback360_respondents_idx_respondent_feedback360_status`;

-- RenameIndex
ALTER TABLE `feedback360_respondents_relations` RENAME INDEX `unique_respondent_feedback` TO `feedback360_respondents_unique_feedback`;

-- RenameIndex
ALTER TABLE `feedback360_reviewers_relations` RENAME INDEX `idx_feedback360` TO `feedback360_reviewers_idx_feedback360`;

-- RenameIndex
ALTER TABLE `feedback360_reviewers_relations` RENAME INDEX `idx_user` TO `feedback360_reviewers_idx_user`;

-- RenameIndex
ALTER TABLE `feedback360_reviewers_relations` RENAME INDEX `unique_feedback_reviewer` TO `feedback360_reviewers_unique_feedback_reviewer`;
