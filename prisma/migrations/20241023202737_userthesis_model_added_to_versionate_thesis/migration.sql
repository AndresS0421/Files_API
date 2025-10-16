/*
  Warnings:

  - You are about to drop the column `user_id` on the `Thesis` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Thesis` DROP FOREIGN KEY `Thesis_user_id_fkey`;

-- AlterTable
ALTER TABLE `Thesis` DROP COLUMN `user_id`;

-- CreateTable
CREATE TABLE `UserThesis` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `thesis_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserThesis_user_id_thesis_id_key`(`user_id`, `thesis_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserThesis` ADD CONSTRAINT `UserThesis_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserThesis` ADD CONSTRAINT `UserThesis_thesis_id_fkey` FOREIGN KEY (`thesis_id`) REFERENCES `Thesis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
