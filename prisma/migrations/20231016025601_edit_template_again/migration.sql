/*
  Warnings:

  - You are about to drop the column `jobId` on the `templates` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[templateId]` on the table `jobs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `templateId` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `templates` DROP FOREIGN KEY `templates_jobId_fkey`;

-- AlterTable
ALTER TABLE `jobs` ADD COLUMN `templateId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `templates` DROP COLUMN `jobId`;

-- CreateIndex
CREATE UNIQUE INDEX `jobs_templateId_key` ON `jobs`(`templateId`);

-- AddForeignKey
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `templates`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
