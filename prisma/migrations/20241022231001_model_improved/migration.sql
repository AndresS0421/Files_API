/*
  Warnings:

  - Added the required column `role` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Users` DROP FOREIGN KEY `Users_credential_id_fkey`;

-- AlterTable
ALTER TABLE `Thesis` MODIFY `thesis_url` VARCHAR(2083) NOT NULL;

-- AlterTable
ALTER TABLE `Users` ADD COLUMN `role` ENUM('STUDENT', 'PROFESSOR', 'ADMINISTRATOR') NOT NULL,
    MODIFY `credential_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Credentials` ADD CONSTRAINT `Credentials_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
