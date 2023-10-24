/*
  Warnings:

  - A unique constraint covering the columns `[userId,instance_name,type]` on the table `courses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,instance_name,position]` on the table `experiences` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,name,status]` on the table `family` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `courses` DROP FOREIGN KEY `courses_userId_fkey`;

-- DropForeignKey
ALTER TABLE `experiences` DROP FOREIGN KEY `experiences_userId_fkey`;

-- DropForeignKey
ALTER TABLE `family` DROP FOREIGN KEY `family_userId_fkey`;

-- DropIndex
DROP INDEX `courses_instance_name_key` ON `courses`;

-- DropIndex
DROP INDEX `courses_type_key` ON `courses`;

-- DropIndex
DROP INDEX `experiences_instance_name_key` ON `experiences`;

-- DropIndex
DROP INDEX `experiences_position_key` ON `experiences`;

-- DropIndex
DROP INDEX `family_name_key` ON `family`;

-- AlterTable
ALTER TABLE `courses` MODIFY `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `experiences` MODIFY `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `family` MODIFY `userId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `applicants_jobId_idx` ON `applicants`(`jobId`);

-- CreateIndex
CREATE INDEX `applicants_userId_idx` ON `applicants`(`userId`);

-- CreateIndex
CREATE INDEX `courses_userId_idx` ON `courses`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `courses_userId_instance_name_type_key` ON `courses`(`userId`, `instance_name`, `type`);

-- CreateIndex
CREATE INDEX `experiences_userId_idx` ON `experiences`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `experiences_userId_instance_name_position_key` ON `experiences`(`userId`, `instance_name`, `position`);

-- CreateIndex
CREATE INDEX `family_userId_idx` ON `family`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `family_userId_name_status_key` ON `family`(`userId`, `name`, `status`);

-- AddForeignKey
ALTER TABLE `courses` ADD CONSTRAINT `courses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experiences` ADD CONSTRAINT `experiences_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `family` ADD CONSTRAINT `family_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `jobs` RENAME INDEX `jobs_authorId_fkey` TO `jobs_authorId_idx`;

-- RenameIndex
ALTER TABLE `jobs` RENAME INDEX `jobs_divisionId_fkey` TO `jobs_divisionId_idx`;

-- RenameIndex
ALTER TABLE `jobs` RENAME INDEX `jobs_positionId_fkey` TO `jobs_positionId_idx`;
