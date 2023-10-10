/*
  Warnings:

  - You are about to drop the column `jobId` on the `division` table. All the data in the column will be lost.
  - You are about to drop the column `jobId` on the `position` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[divisionId]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[positionId]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `divisionId` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `positionId` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `division` DROP FOREIGN KEY `Division_jobId_fkey`;

-- DropForeignKey
ALTER TABLE `position` DROP FOREIGN KEY `Position_jobId_fkey`;

-- AlterTable
ALTER TABLE `division` DROP COLUMN `jobId`;

-- AlterTable
ALTER TABLE `job` ADD COLUMN `divisionId` INTEGER NOT NULL,
    ADD COLUMN `positionId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `position` DROP COLUMN `jobId`;

-- CreateIndex
CREATE UNIQUE INDEX `Job_divisionId_key` ON `Job`(`divisionId`);

-- CreateIndex
CREATE UNIQUE INDEX `Job_positionId_key` ON `Job`(`positionId`);

-- AddForeignKey
ALTER TABLE `Job` ADD CONSTRAINT `Job_divisionId_fkey` FOREIGN KEY (`divisionId`) REFERENCES `Division`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Job` ADD CONSTRAINT `Job_positionId_fkey` FOREIGN KEY (`positionId`) REFERENCES `Position`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
