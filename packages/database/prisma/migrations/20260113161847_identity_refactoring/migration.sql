/*
  Warnings:

  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `user_roles` DROP FOREIGN KEY `user_roles_ibfk_1`;

-- DropForeignKey
ALTER TABLE `user_roles` DROP FOREIGN KEY `user_roles_ibfk_2`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_ibfk_1`;

-- DropTable
DROP TABLE `roles`;

-- DropTable
DROP TABLE `user_roles`;

-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `identity_roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` ENUM('admin', 'hr', 'manager', 'employee') NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `identity_unique_role_code`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `identity_user_roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `role_code` ENUM('admin', 'hr', 'manager', 'employee') NOT NULL,
    `assigned_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `identity_idx_role_code`(`role_code`),
    INDEX `identity_idx_user_id`(`user_id`),
    UNIQUE INDEX `identity_unique_user_role`(`user_id`, `role_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `identity_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(100) NOT NULL,
    `second_name` VARCHAR(100) NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `full_name` VARCHAR(302) NULL,
    `email` VARCHAR(100) NOT NULL,
    `password_hash` VARCHAR(300) NOT NULL,
    `status` ENUM('inactive', 'active') NOT NULL DEFAULT 'active',
    `position_id` INTEGER NULL,
    `team_id` INTEGER NULL,
    `manager_id` INTEGER NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    INDEX `identity_idx_manager`(`manager_id`),
    INDEX `identity_idx_position`(`position_id`),
    INDEX `identity_idx_team`(`team_id`),
    INDEX `identity_idx_title`(`full_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `identity_user_roles` ADD CONSTRAINT `identity_user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `identity_users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `identity_user_roles` ADD CONSTRAINT `identity_user_roles_ibfk_2` FOREIGN KEY (`role_code`) REFERENCES `identity_roles`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `identity_users` ADD CONSTRAINT `identity_users_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `identity_users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
