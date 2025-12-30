-- CreateTable
CREATE TABLE `clusters_users_relations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cycle_id` INTEGER NULL,
    `cluster_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `score` DOUBLE NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `cycle_id`(`cycle_id`),
    INDEX `idx_cluster`(`cluster_id`),
    INDEX `idx_user`(`user_id`),
    UNIQUE INDEX `unique_cluster_member`(`cluster_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `competences` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `unique_competence_title`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `competences_clusters` (
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

    INDEX `idx_competence`(`competence_id`),
    INDEX `idx_cycle`(`cycle_id`),
    UNIQUE INDEX `unique_competence_cluster`(`cycle_id`, `competence_id`, `lower_bound`, `upper_bound`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feedback360` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ratee_id` INTEGER NOT NULL,
    `ratee_note` TEXT NULL,
    `position_id` INTEGER NOT NULL,
    `hr_id` INTEGER NOT NULL,
    `hr_note` TEXT NULL,
    `cycle_id` INTEGER NULL,
    `stage` ENUM('canceled', 'verification_by_hr', 'verification_by_user', 'rejected', 'self_assessment', 'waiting_to_start', 'in_progress', 'research', 'finished') NOT NULL DEFAULT 'verification_by_hr',
    `report_id` INTEGER NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_cycle`(`cycle_id`),
    INDEX `idx_hr`(`hr_id`),
    INDEX `idx_position`(`position_id`),
    INDEX `idx_ratee`(`ratee_id`),
    INDEX `idx_report_id`(`report_id`),
    INDEX `idx_stage`(`stage`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feedback360_answers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `feedback360_id` INTEGER NOT NULL,
    `question_id` INTEGER NOT NULL,
    `respondent_category` ENUM('self_assessment', 'team', 'other') NOT NULL,
    `answer_type` ENUM('numerical_scale', 'text_field') NOT NULL DEFAULT 'numerical_scale',
    `numerical_value` TINYINT NULL,
    `text_value` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_feedback360`(`feedback360_id`),
    INDEX `idx_question`(`question_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feedback360_cycles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `hr_id` INTEGER NOT NULL,
    `stage` ENUM('canceled', 'new', 'active', 'finished', 'archive') NOT NULL DEFAULT 'new',
    `is_active` BOOLEAN NULL DEFAULT true,
    `start_date` TIMESTAMP(0) NOT NULL,
    `review_deadline` TIMESTAMP(0) NULL,
    `approval_deadline` TIMESTAMP(0) NULL,
    `survey_deadline` TIMESTAMP(0) NULL,
    `end_date` TIMESTAMP(0) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_hr`(`hr_id`),
    INDEX `idx_stage`(`stage`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feedback360_questions_relations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `feedback360_id` INTEGER NOT NULL,
    `question_id` INTEGER NOT NULL,
    `question_title` VARCHAR(1024) NOT NULL,
    `answer_type` ENUM('numerical_scale', 'text_field') NOT NULL,
    `competence_id` INTEGER NOT NULL,
    `is_for_selfassessment` BOOLEAN NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_feedback360`(`feedback360_id`),
    INDEX `idx_question_id`(`question_id`),
    UNIQUE INDEX `unique_feedback_template`(`feedback360_id`, `question_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feedback360_reports` (
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

    UNIQUE INDEX `unique_feedback360`(`feedback360_id`),
    INDEX `idx_cycle`(`cycle_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feedback360_respondents_relations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `feedback360_id` INTEGER NOT NULL,
    `respondent_id` INTEGER NOT NULL,
    `respondent_category` ENUM('self_assessment', 'team', 'other') NOT NULL,
    `feedback360_status` ENUM('pending', 'inprogress', 'completed', 'canceled') NOT NULL DEFAULT 'pending',
    `respondent_note` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_feedback360`(`feedback360_id`),
    INDEX `idx_feedback360_status`(`feedback360_status`),
    INDEX `idx_respondent`(`respondent_id`),
    INDEX `idx_respondent_feedback360_status`(`respondent_id`, `feedback360_status`),
    UNIQUE INDEX `unique_respondent_feedback`(`respondent_id`, `feedback360_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feedback360_reviewers_relations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `feedback360_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_feedback360`(`feedback360_id`),
    INDEX `idx_user`(`user_id`),
    UNIQUE INDEX `unique_feedback_reviewer`(`feedback360_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `positions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `questions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(1024) NOT NULL,
    `answer_type` ENUM('numerical_scale', 'text_field') NOT NULL,
    `competence_id` INTEGER NOT NULL,
    `is_for_selfassessment` BOOLEAN NULL DEFAULT false,
    `question_status` ENUM('archive', 'active') NOT NULL DEFAULT 'active',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_competence`(`competence_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `questions_positions_relations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question_id` INTEGER NOT NULL,
    `position_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `position_id`(`position_id`),
    UNIQUE INDEX `unique_relation`(`question_id`, `position_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reports_analytics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `report_id` INTEGER NOT NULL,
    `entity_type` ENUM('question', 'competence') NOT NULL,
    `entity_id` INTEGER NULL,
    `entity_title` VARCHAR(1024) NOT NULL,
    `average_by_self_assessment` DOUBLE NULL,
    `average_by_team` DOUBLE NULL,
    `average_by_other` DOUBLE NULL,
    `delta_by_self_assessment` DOUBLE NULL,
    `delta_by_team` DOUBLE NULL,
    `delta_by_other` DOUBLE NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_report`(`report_id`),
    UNIQUE INDEX `unique_report_entity`(`report_id`, `entity_type`, `entity_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reports_comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `report_id` INTEGER NOT NULL,
    `comment` TEXT NULL,
    `comment_sentiment` ENUM('negative', 'positive') NOT NULL DEFAULT 'positive',
    `number_of_mentions` INTEGER NULL,
    `respondent_category` ENUM('self_assessment', 'team', 'other') NOT NULL,

    INDEX `idx_report`(`report_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teams` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `head_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_head`(`head_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(128) NOT NULL,
    `second_name` VARCHAR(128) NULL,
    `last_name` VARCHAR(128) NOT NULL,
    `full_name` VARCHAR(255) NULL,
    `email` VARCHAR(64) NOT NULL,
    `password_hash` VARCHAR(300) NOT NULL,
    `status` ENUM('inactive', 'active') NOT NULL DEFAULT 'active',
    `position_id` INTEGER NOT NULL,
    `team_id` INTEGER NOT NULL,
    `head_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    INDEX `idx_head`(`head_id`),
    INDEX `idx_position`(`position_id`),
    INDEX `idx_team`(`team_id`),
    INDEX `idx_title`(`full_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `clusters_users_relations` ADD CONSTRAINT `clusters_users_relations_ibfk_1` FOREIGN KEY (`cycle_id`) REFERENCES `feedback360_cycles`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `clusters_users_relations` ADD CONSTRAINT `clusters_users_relations_ibfk_2` FOREIGN KEY (`cluster_id`) REFERENCES `competences_clusters`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `clusters_users_relations` ADD CONSTRAINT `clusters_users_relations_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `competences_clusters` ADD CONSTRAINT `competences_clusters_ibfk_1` FOREIGN KEY (`cycle_id`) REFERENCES `feedback360_cycles`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `competences_clusters` ADD CONSTRAINT `competences_clusters_ibfk_2` FOREIGN KEY (`competence_id`) REFERENCES `competences`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360` ADD CONSTRAINT `feedback360_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `feedback360_reports`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360` ADD CONSTRAINT `feedback360_ibfk_2` FOREIGN KEY (`cycle_id`) REFERENCES `feedback360_cycles`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360` ADD CONSTRAINT `feedback360_ibfk_3` FOREIGN KEY (`ratee_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360` ADD CONSTRAINT `feedback360_ibfk_4` FOREIGN KEY (`hr_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360` ADD CONSTRAINT `feedback360_ibfk_5` FOREIGN KEY (`position_id`) REFERENCES `positions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_answers` ADD CONSTRAINT `feedback360_answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_answers` ADD CONSTRAINT `feedback360_answers_ibfk_2` FOREIGN KEY (`feedback360_id`) REFERENCES `feedback360`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_cycles` ADD CONSTRAINT `feedback360_cycles_ibfk_1` FOREIGN KEY (`hr_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_questions_relations` ADD CONSTRAINT `feedback360_questions_relations_ibfk_1` FOREIGN KEY (`feedback360_id`) REFERENCES `feedback360`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_questions_relations` ADD CONSTRAINT `feedback360_questions_relations_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_reports` ADD CONSTRAINT `feedback360_reports_ibfk_1` FOREIGN KEY (`feedback360_id`) REFERENCES `feedback360`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_reports` ADD CONSTRAINT `feedback360_reports_ibfk_2` FOREIGN KEY (`cycle_id`) REFERENCES `feedback360_cycles`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_respondents_relations` ADD CONSTRAINT `feedback360_respondents_relations_ibfk_1` FOREIGN KEY (`feedback360_id`) REFERENCES `feedback360`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_respondents_relations` ADD CONSTRAINT `feedback360_respondents_relations_ibfk_2` FOREIGN KEY (`respondent_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_reviewers_relations` ADD CONSTRAINT `feedback360_reviewers_relations_ibfk_1` FOREIGN KEY (`feedback360_id`) REFERENCES `feedback360`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback360_reviewers_relations` ADD CONSTRAINT `feedback360_reviewers_relations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`competence_id`) REFERENCES `competences`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `questions_positions_relations` ADD CONSTRAINT `questions_positions_relations_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `questions_positions_relations` ADD CONSTRAINT `questions_positions_relations_ibfk_2` FOREIGN KEY (`position_id`) REFERENCES `positions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reports_analytics` ADD CONSTRAINT `reports_analytics_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `feedback360_reports`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reports_comments` ADD CONSTRAINT `reports_comments_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `feedback360_reports`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `teams` ADD CONSTRAINT `teams_ibfk_1` FOREIGN KEY (`head_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`head_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_3` FOREIGN KEY (`position_id`) REFERENCES `positions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
