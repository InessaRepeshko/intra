CREATE TABLE `feedback360_cycles` (
  `id` int PRIMARY KEY AUTO_INCREMENT COMMENT 'Унікальний ідентифікатор циклу анкетування',
  `title` varchar(255) NOT NULL COMMENT 'Назва циклу',
  `description` text COMMENT 'Опис циклу',
  `hr_id` int NOT NULL COMMENT 'ID HR менеджера',
  `stage` ENUM ('canceled', 'new', 'active', 'finished', 'archive') NOT NULL DEFAULT 'new' COMMENT 'Етап циклу анкетування',
  `is_active` bool DEFAULT 1 COMMENT 'Чи є цикл активним',
  `start_date` datetime NOT NULL COMMENT 'Дата початку',
  `review_deadline` datetime COMMENT 'До якої дати треба узгодити анету',
  `approval_deadline` datetime COMMENT 'До якої дати HR має затвердити анкету',
  `survey_deadline` datetime COMMENT 'Дедлайн подачі відповідей',
  `end_date` datetime NOT NULL COMMENT 'Дата завершення',
  `created_at` datetime NOT NULL COMMENT 'Дата створення',
  `updated_at` datetime COMMENT 'Дата оновлення'
);

CREATE TABLE `feedback360` (
  `id` int PRIMARY KEY AUTO_INCREMENT COMMENT 'Унікальний ідентифікатор анкети',
  `ratee_id` int NOT NULL COMMENT 'ID співробітника, якого оцінюють',
  `ratee_note` text COMMENT 'Примітка співробітника',
  `position_id` int NOT NULL COMMENT 'ID посади',
  `hr_id` int NOT NULL COMMENT 'ID HR менеджера',
  `hr_note` text COMMENT 'Примітка HR',
  `cycle_id` int COMMENT 'ID циклу анкетування',
  `stage` ENUM ('canceled', 'verification_by_hr', 'verification_by_user', 'rejected', 'self_assessment', 'waiting_to_start', 'in_progress', 'research', 'finished') NOT NULL DEFAULT 'verification_by_hr' COMMENT 'Етап анкетування',
  `report_id` int COMMENT 'ID звіту',
  `created_at` datetime NOT NULL COMMENT 'Дата створення',
  `updated_at` datetime COMMENT 'Дата оновлення'
);

CREATE TABLE `feedback360_respondents_relations` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `feedback360_id` int NOT NULL COMMENT 'ID анкети',
  `respondent_id` int NOT NULL COMMENT 'ID респондента',
  `respondent_category` ENUM ('self_assessment', 'team', 'other') NOT NULL COMMENT 'Категорія респондента: самооцінка, колега, інший',
  `feedback360_status` ENUM ('pending', 'inprogress', 'completed', 'canceled') NOT NULL DEFAULT 'pending' COMMENT 'Статус відповіді на анкету: очікування, в процесі, завершено, скасовано',
  `respondent_note` text COMMENT 'Примітка респондента',
  `created_at` datetime NOT NULL COMMENT 'Дата створення',
  `updated_at` datetime COMMENT 'Дата оновлення'
);

CREATE TABLE `questions` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(1024) NOT NULL COMMENT 'Назва питання',
  `answer_type` ENUM ('numerical_scale', 'text_field') NOT NULL COMMENT 'Тип відповіді: числова шкала, текстове поле',
  `competence_id` int NOT NULL COMMENT 'ID компетенції',
  `is_for_selfassessment` bool DEFAULT 0 COMMENT 'Питання для самооцінки',
  `question_status` ENUM ('archive', 'active') NOT NULL DEFAULT 'active' COMMENT 'Статус питання: архівоване, активне',
  `created_at` datetime NOT NULL COMMENT 'Дата створення',
  `updated_at` datetime COMMENT 'Дата оновлення'
);

CREATE TABLE `questions_positions_relations` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `question_id` int NOT NULL COMMENT 'ID питання',
  `position_id` int NOT NULL COMMENT 'ID позиції',
  `created_at` datetime NOT NULL COMMENT 'Дата створення'
);

CREATE TABLE `feedback360_questions_relations` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `feedback360_id` int NOT NULL COMMENT 'ID анкети',
  `question_id` int NOT NULL COMMENT 'ID питання',
  `question_title` varchar(1024) NOT NULL COMMENT 'Назва питання',
  `answer_type` ENUM ('numerical_scale', 'text_field') NOT NULL COMMENT 'Тип відповіді: числова шкала, текстове поле',
  `competence_id` int NOT NULL COMMENT 'ID компетенції',
  `is_for_selfassessment` bool DEFAULT 0 COMMENT 'Питання для самооцінки',
  `created_at` datetime NOT NULL COMMENT 'Дата створення'
);

CREATE TABLE `feedback360_answers` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `feedback360_id` int NOT NULL COMMENT 'ID анкети',
  `question_id` int NOT NULL COMMENT 'ID питання',
  `respondent_category` ENUM ('self_assessment', 'team', 'other') NOT NULL COMMENT 'Категорія респондента',
  `answer_type` ENUM ('numerical_scale', 'text_field') NOT NULL DEFAULT 'numerical_scale' COMMENT 'Тип відповіді на питання: числова шкала, текстове поле',
  `numerical_value` tinyint COMMENT 'Значення числової відповіді: 0-не знаю, 1-ніколи, 2-інколи, 3-часто, 4-зазвичай, 5-завжди',
  `text_value` text COMMENT 'Значення текстової відповіді',
  `created_at` datetime NOT NULL COMMENT 'Дата створення',
  CONSTRAINT `check_feedback360_answers_score_range` CHECK (0 <= numerical_value <= 5),
  CONSTRAINT `check_feedback360_answers_answer_presence` CHECK ((numerical_value is not null) or (text_value is not null))
);

CREATE TABLE `feedback360_reports` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `feedback360_id` int NOT NULL COMMENT 'ID анкети',
  `cycle_id` int COMMENT 'ID циклу анкетування',
  `turnout_of_team` double COMMENT 'Явка колег на анкетування, %',
  `turnout_of_other` double COMMENT 'Явка інших на анкетування, %',
  `total_average_by_self_assessment` double COMMENT 'Загальна середня самооцінка',
  `total_average_by_team` double COMMENT 'Загальна середня оцінка від колег',
  `total_average_by_others` double COMMENT 'Загальна середня оцінка від інших',
  `total_delta_by_self_assessment` double COMMENT 'Дельта самооцінки, %',
  `total_delta_by_team` double COMMENT 'Дельта оцінки колег, %',
  `total_delta_by_others` double COMMENT 'Дельта оцінки інших, %',
  `created_at` datetime NOT NULL COMMENT 'Дата створення'
);

CREATE TABLE `reports_analytics` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `report_id` int NOT NULL COMMENT 'ID звіту',
  `entity_type` ENUM ('question', 'competence') NOT NULL COMMENT 'Тип: питання, компетенція',
  `entity_id` int COMMENT 'ID питання або компетенції',
  `entity_title` varchar(1024) NOT NULL COMMENT 'Назва питання або компетенції',
  `average_by_self_assessment` double COMMENT 'Середня самооцінка',
  `average_by_team` double COMMENT 'Середня оцінка колег',
  `average_by_other` double COMMENT 'Середня оцінка інших',
  `delta_by_self_assessment` double COMMENT 'Дельта самооцінки',
  `delta_by_team` double COMMENT 'Дельта оцінки колег, %',
  `delta_by_other` double COMMENT 'Дельта оцінки інших, %',
  `created_at` datetime NOT NULL COMMENT 'Дата створення'
);

CREATE TABLE `competences_clusters` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `cycle_id` int COMMENT 'ID циклу анкетування',
  `competence_id` int NOT NULL COMMENT 'ID компетенції (users_competences)',
  `lower_bound` double NOT NULL COMMENT 'Нижня межа інтервалу кластера, включно',
  `upper_bound` double NOT NULL COMMENT 'Верхня межа інтервалу кластера',
  `min_score` double NOT NULL COMMENT 'Мінімальна оцінка в кластері',
  `max_score` double NOT NULL COMMENT 'Максимальна оцінка в кластері',
  `average_score` double NOT NULL COMMENT 'Середнє значення оцінки в кластері',
  `employees_count` int NOT NULL COMMENT 'Кількість співробітників у кластері',
  `created_at` datetime NOT NULL COMMENT 'Дата створення',
  `updated_at` datetime COMMENT 'Дата оновлення'
);

CREATE TABLE `clusters_users_relations` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `cycle_id` int COMMENT 'ID циклу анкетування',
  `cluster_id` int NOT NULL COMMENT 'ID кластера (feedback360_competence_clusters)',
  `user_id` int NOT NULL COMMENT 'ID співробітника (users)',
  `score` double NOT NULL COMMENT 'Оцінка працівника за компетенцією [0-5]',
  `created_at` datetime NOT NULL COMMENT 'Дата створення',
  `updated_at` datetime COMMENT 'Дата оновлення',
  CONSTRAINT `check_clusters_users_relations_score_range` CHECK (0 <= score <= 5)
);

CREATE TABLE `reports_comments` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `report_id` int NOT NULL COMMENT 'ID звіту',
  `comment` text COMMENT 'Значення фідбеку',
  `comment_sentiment` ENUM ('negative', 'positive') NOT NULL DEFAULT 'positive' COMMENT 'Тип коментаря: над чим попрацювати, що добре',
  `number_of_mentions` int COMMENT 'Кількість згадувань',
  `respondent_category` ENUM ('self_assessment', 'team', 'other') NOT NULL COMMENT 'Категорія респондента'
);

CREATE TABLE `feedback360_reviewers_relations` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `feedback360_id` int NOT NULL COMMENT 'ID анкети',
  `user_id` int NOT NULL COMMENT 'ID рецензента',
  `created_at` datetime NOT NULL COMMENT 'Дата додавання'
);

CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT COMMENT 'Унікальний ідентифікатор користувача',
  `first_name` varchar(128) NOT NULL COMMENT 'Ім''я (EN)',
  `second_name` varchar(128) COMMENT 'По батькові (EN)',
  `last_name` varchar(128) NOT NULL COMMENT 'Прізвище (EN)',
  `full_name` varchar(255) COMMENT 'Повне ім''я (EN)',
  `email` varchar(64) UNIQUE NOT NULL COMMENT 'Email адреса',
  `password_hash` varchar(300) NOT NULL COMMENT 'Хеш пароля',
  `status` ENUM ('inactive', 'active') NOT NULL DEFAULT 'active' COMMENT 'Статус',
  `position_id` int NOT NULL COMMENT 'ID посади',
  `team_id` int NOT NULL COMMENT 'ID команди',
  `head_id` int NOT NULL COMMENT 'ID керівника',
  `created_at` datetime NOT NULL COMMENT 'Дата створення',
  `updated_at` datetime COMMENT 'Дата оновлення'
);

CREATE TABLE `positions` (
  `id` int PRIMARY KEY AUTO_INCREMENT COMMENT 'Унікальний ідентифікатор посади',
  `title` varchar(255) NOT NULL COMMENT 'Назва посади',
  `description` text COMMENT 'Опис посади',
  `created_at` datetime NOT NULL COMMENT 'Дата створення',
  `updated_at` datetime COMMENT 'Дата оновлення'
);

CREATE TABLE `competences` (
  `id` int PRIMARY KEY AUTO_INCREMENT COMMENT 'Унікальний ідентифікатор компетенції',
  `title` varchar(255) NOT NULL COMMENT 'Назва компетенції',
  `description` text COMMENT 'Опис компетенції',
  `created_at` datetime NOT NULL COMMENT 'Дата створення',
  `updated_at` datetime COMMENT 'Дата зміни'
);

CREATE TABLE `teams` (
  `id` int PRIMARY KEY AUTO_INCREMENT COMMENT 'Унікальний ідентифікатор команди',
  `title` varchar(255) NOT NULL COMMENT 'Назва команди',
  `description` text COMMENT 'Опис команди',
  `head_id` int NOT NULL COMMENT 'ID керівника команди',
  `created_at` datetime NOT NULL COMMENT 'Дата створення',
  `updated_at` datetime COMMENT 'Дата оновлення'
);

CREATE INDEX `idx_stage` ON `feedback360_cycles` (`stage`);

CREATE INDEX `idx_hr` ON `feedback360_cycles` (`hr_id`);

CREATE INDEX `idx_stage` ON `feedback360` (`stage`);

CREATE INDEX `idx_cycle` ON `feedback360` (`cycle_id`);

CREATE INDEX `idx_report_id` ON `feedback360` (`report_id`);

CREATE INDEX `idx_ratee` ON `feedback360` (`ratee_id`);

CREATE INDEX `idx_hr` ON `feedback360` (`hr_id`);

CREATE INDEX `idx_position` ON `feedback360` (`position_id`);

CREATE UNIQUE INDEX `unique_respondent_feedback` ON `feedback360_respondents_relations` (`respondent_id`, `feedback360_id`);

CREATE INDEX `idx_respondent` ON `feedback360_respondents_relations` (`respondent_id`);

CREATE INDEX `idx_feedback360` ON `feedback360_respondents_relations` (`feedback360_id`);

CREATE INDEX `idx_feedback360_status` ON `feedback360_respondents_relations` (`feedback360_status`);

CREATE INDEX `idx_respondent_feedback360_status` ON `feedback360_respondents_relations` (`respondent_id`, `feedback360_status`);

CREATE INDEX `idx_competence` ON `questions` (`competence_id`);

CREATE UNIQUE INDEX `unique_relation` ON `questions_positions_relations` (`question_id`, `position_id`);

CREATE INDEX `idx_feedback360` ON `feedback360_questions_relations` (`feedback360_id`);

CREATE INDEX `idx_question_id` ON `feedback360_questions_relations` (`question_id`);

CREATE UNIQUE INDEX `unique_feedback_template` ON `feedback360_questions_relations` (`feedback360_id`, `question_id`);

CREATE INDEX `idx_question` ON `feedback360_answers` (`question_id`);

CREATE INDEX `idx_feedback360` ON `feedback360_answers` (`feedback360_id`);

CREATE UNIQUE INDEX `unique_feedback360` ON `feedback360_reports` (`feedback360_id`);

CREATE INDEX `idx_cycle` ON `feedback360_reports` (`cycle_id`);

CREATE INDEX `idx_report` ON `reports_analytics` (`report_id`);

CREATE UNIQUE INDEX `unique_report_entity` ON `reports_analytics` (`report_id`, `entity_type`, `entity_id`);

CREATE INDEX `idx_competence` ON `competences_clusters` (`competence_id`);

CREATE INDEX `idx_cycle` ON `competences_clusters` (`cycle_id`);

CREATE UNIQUE INDEX `unique_competence_cluster` ON `competences_clusters` (`cycle_id`, `competence_id`, `lower_bound`, `upper_bound`);

CREATE INDEX `idx_cluster` ON `clusters_users_relations` (`cluster_id`);

CREATE INDEX `idx_user` ON `clusters_users_relations` (`user_id`);

CREATE UNIQUE INDEX `unique_cluster_member` ON `clusters_users_relations` (`cluster_id`, `user_id`);

CREATE INDEX `idx_report` ON `reports_comments` (`report_id`);

CREATE UNIQUE INDEX `unique_feedback_reviewer` ON `feedback360_reviewers_relations` (`feedback360_id`, `user_id`);

CREATE INDEX `idx_feedback360` ON `feedback360_reviewers_relations` (`feedback360_id`);

CREATE INDEX `idx_user` ON `feedback360_reviewers_relations` (`user_id`);

CREATE INDEX `idx_title` ON `users` (`full_name`);

CREATE INDEX `idx_position` ON `users` (`position_id`);

CREATE INDEX `idx_team` ON `users` (`team_id`);

CREATE INDEX `idx_head` ON `users` (`head_id`);

CREATE UNIQUE INDEX `unique_competence_title` ON `competences` (`title`);

CREATE INDEX `idx_head` ON `teams` (`head_id`);

ALTER TABLE `feedback360_cycles` COMMENT = 'Таблиця циклів Feedback 360, які обʼєднують анкети за певний період.';

ALTER TABLE `feedback360` COMMENT = 'Основна таблиця анкет Feedback 360. Зберігає інформацію про анкетування співробітників.';

ALTER TABLE `feedback360_respondents_relations` COMMENT = 'Респонденти анкети - працівники, які дають оцінку співробітнику';

ALTER TABLE `questions` COMMENT = 'Шаблони питань для анкет. Можуть бути прив''язані до різних позицій через таблицю relations.';

ALTER TABLE `questions_positions_relations` COMMENT = 'Зв''язки між питаннями та позиціями працівників';

ALTER TABLE `feedback360_questions_relations` COMMENT = 'Конкретні питання в анкеті, створені на основі бібліотеки питань';

ALTER TABLE `feedback360_answers` COMMENT = 'Відповіді респондентів на питання анкети';

ALTER TABLE `feedback360_reports` COMMENT = 'Індивідуальні звіти за результатами анкетування';

ALTER TABLE `reports_analytics` COMMENT = 'Детальна аналітика по питаннях та компетенціях у індивідуальному звіті';

ALTER TABLE `competences_clusters` COMMENT = 'Агреговані показники по кожному кластеру (інтервал, середнє, мін/макс, розмір кластера).';

ALTER TABLE `clusters_users_relations` COMMENT = 'Повний перелік співробітників у кожному кластері з їх фактичною оцінкою.';

ALTER TABLE `reports_comments` COMMENT = 'Текстові фідбеки в індивідуальних звітах (що добре/над чим попрацювати)';

ALTER TABLE `feedback360_reviewers_relations` COMMENT = 'Рецензенти, які аналізують завершені анкети';

ALTER TABLE `users` COMMENT = 'Таблиця користувачів (працівників).';

ALTER TABLE `positions` COMMENT = 'Посади співробітників. Прив''язані до питань Feedback360 через relations.';

ALTER TABLE `competences` COMMENT = 'Компетенції співробітників. Використовуються в питаннях Feedback360 для групування питань за компетенціями.';

ALTER TABLE `teams` COMMENT = 'Таблиця команд. Використовується для групування користувачів та команд.';

ALTER TABLE `feedback360_respondents_relations` ADD FOREIGN KEY (`feedback360_id`) REFERENCES `feedback360` (`id`);

ALTER TABLE `feedback360_questions_relations` ADD FOREIGN KEY (`feedback360_id`) REFERENCES `feedback360` (`id`);

ALTER TABLE `feedback360_reports` ADD FOREIGN KEY (`feedback360_id`) REFERENCES `feedback360` (`id`);

ALTER TABLE `feedback360_reviewers_relations` ADD FOREIGN KEY (`feedback360_id`) REFERENCES `feedback360` (`id`);

ALTER TABLE `feedback360_questions_relations` ADD FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`);

ALTER TABLE `questions_positions_relations` ADD FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`);

ALTER TABLE `feedback360_answers` ADD FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`);

ALTER TABLE `feedback360_answers` ADD FOREIGN KEY (`feedback360_id`) REFERENCES `feedback360` (`id`);

ALTER TABLE `reports_analytics` ADD FOREIGN KEY (`report_id`) REFERENCES `feedback360_reports` (`id`);

ALTER TABLE `reports_comments` ADD FOREIGN KEY (`report_id`) REFERENCES `feedback360_reports` (`id`);

ALTER TABLE `feedback360` ADD FOREIGN KEY (`report_id`) REFERENCES `feedback360_reports` (`id`);

ALTER TABLE `feedback360` ADD FOREIGN KEY (`cycle_id`) REFERENCES `feedback360_cycles` (`id`);

ALTER TABLE `feedback360_reports` ADD FOREIGN KEY (`cycle_id`) REFERENCES `feedback360_cycles` (`id`);

ALTER TABLE `competences_clusters` ADD FOREIGN KEY (`cycle_id`) REFERENCES `feedback360_cycles` (`id`);

ALTER TABLE `clusters_users_relations` ADD FOREIGN KEY (`cycle_id`) REFERENCES `feedback360_cycles` (`id`);

ALTER TABLE `users` ADD FOREIGN KEY (`head_id`) REFERENCES `users` (`id`);

ALTER TABLE `users` ADD FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`);

ALTER TABLE `teams` ADD FOREIGN KEY (`head_id`) REFERENCES `users` (`id`);

ALTER TABLE `users` ADD FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`);

ALTER TABLE `feedback360` ADD FOREIGN KEY (`ratee_id`) REFERENCES `users` (`id`);

ALTER TABLE `feedback360` ADD FOREIGN KEY (`hr_id`) REFERENCES `users` (`id`);

-- FIX: у вихідному SQL було REFERENCES users(position_id), але users.position_id не є UNIQUE/PK, тому MySQL не дозволить такий FK.
ALTER TABLE `feedback360` ADD FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`);

ALTER TABLE `feedback360_cycles` ADD FOREIGN KEY (`hr_id`) REFERENCES `users` (`id`);

ALTER TABLE `feedback360_respondents_relations` ADD FOREIGN KEY (`respondent_id`) REFERENCES `users` (`id`);

ALTER TABLE `feedback360_reviewers_relations` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `questions_positions_relations` ADD FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`);

ALTER TABLE `questions` ADD FOREIGN KEY (`competence_id`) REFERENCES `competences` (`id`);

ALTER TABLE `clusters_users_relations` ADD FOREIGN KEY (`cluster_id`) REFERENCES `competences_clusters` (`id`);

ALTER TABLE `competences_clusters` ADD FOREIGN KEY (`competence_id`) REFERENCES `competences` (`id`);

ALTER TABLE `clusters_users_relations` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);


