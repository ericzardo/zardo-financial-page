-- AlterTable
ALTER TABLE `users` ADD COLUMN `avatar_url` VARCHAR(191) NULL DEFAULT '/avatars/1.webp',
    ADD COLUMN `is_privacy_enabled` BOOLEAN NOT NULL DEFAULT false;
