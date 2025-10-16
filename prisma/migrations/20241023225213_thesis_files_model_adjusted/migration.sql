/*
  Warnings:

  - You are about to drop the `UserThesis` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `Thesis` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `UserThesis` DROP FOREIGN KEY `UserThesis_thesis_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserThesis` DROP FOREIGN KEY `UserThesis_user_id_fkey`;

-- AlterTable
ALTER TABLE `Thesis` ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `UserThesis`;

-- CreateTable
CREATE TABLE `thesisFiles` (
    `id` VARCHAR(191) NOT NULL,
    `thesis_id` VARCHAR(191) NOT NULL,
    `thesis_url` VARCHAR(500) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Thesis` ADD CONSTRAINT `Thesis_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thesisFiles` ADD CONSTRAINT `thesisFiles_thesis_id_fkey` FOREIGN KEY (`thesis_id`) REFERENCES `Thesis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
