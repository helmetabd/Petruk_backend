/*
  Warnings:

  - You are about to drop the `division` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `job` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `position` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_jobtoskill` DROP FOREIGN KEY `_JobToSkill_A_fkey`;

-- DropForeignKey
ALTER TABLE `job` DROP FOREIGN KEY `Job_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `job` DROP FOREIGN KEY `Job_divisionId_fkey`;

-- DropForeignKey
ALTER TABLE `job` DROP FOREIGN KEY `Job_positionId_fkey`;

-- DropTable
DROP TABLE `division`;

-- DropTable
DROP TABLE `job`;

-- DropTable
DROP TABLE `position`;

-- CreateTable
CREATE TABLE `jobs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `authorId` INTEGER NOT NULL,
    `salary` INTEGER NOT NULL,
    `details` LONGTEXT NOT NULL,
    `divisionId` INTEGER NOT NULL,
    `positionId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `jobs_authorId_key`(`authorId`),
    UNIQUE INDEX `jobs_divisionId_key`(`divisionId`),
    UNIQUE INDEX `jobs_positionId_key`(`positionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `divisions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,

    UNIQUE INDEX `divisions_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `positions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,

    UNIQUE INDEX `positions_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_divisionId_fkey` FOREIGN KEY (`divisionId`) REFERENCES `divisions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_positionId_fkey` FOREIGN KEY (`positionId`) REFERENCES `positions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_JobToSkill` ADD CONSTRAINT `_JobToSkill_A_fkey` FOREIGN KEY (`A`) REFERENCES `jobs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
