/*
  Warnings:

  - You are about to drop the column `thesis_url` on the `Thesis` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Thesis` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `thesis_url` to the `UserThesis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Thesis` DROP COLUMN `thesis_url`;

-- AlterTable
ALTER TABLE `UserThesis` ADD COLUMN `thesis_url` VARCHAR(500) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Thesis_title_key` ON `Thesis`(`title`);
