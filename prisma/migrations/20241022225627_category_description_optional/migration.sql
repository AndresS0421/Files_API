-- DropForeignKey
ALTER TABLE `Credentials` DROP FOREIGN KEY `Credentials_user_id_fkey`;

-- AlterTable
ALTER TABLE `Categories` MODIFY `description` VARCHAR(255) NULL;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_credential_id_fkey` FOREIGN KEY (`credential_id`) REFERENCES `Credentials`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
