/*
  Warnings:

  - You are about to drop the column `category` on the `Thesis` table. All the data in the column will be lost.
  - Added the required column `category_id` to the `Thesis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Thesis` DROP COLUMN `category`,
    ADD COLUMN `category_id` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Categories` (
    `id` VARCHAR(191) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Thesis` ADD CONSTRAINT `Thesis_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
