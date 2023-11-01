/*
  Warnings:

  - You are about to drop the column `questionnaireId` on the `answers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[applicantId,questionId]` on the table `answers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `questionId` to the `answers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `answers` DROP FOREIGN KEY `answers_questionnaireId_fkey`;

-- DropIndex
DROP INDEX `answers_applicantId_questionnaireId_key` ON `answers`;

-- AlterTable
ALTER TABLE `answers` DROP COLUMN `questionnaireId`,
    ADD COLUMN `questionId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `responses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(255) NOT NULL,
    `applicantId` INTEGER NOT NULL,
    `questionnaireId` INTEGER NOT NULL,

    INDEX `responses_applicantId_idx`(`applicantId`),
    INDEX `responses_questionnaireId_idx`(`questionnaireId`),
    UNIQUE INDEX `responses_applicantId_questionnaireId_key`(`applicantId`, `questionnaireId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recomendations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(100) NOT NULL,
    `job` VARCHAR(150) NOT NULL,
    `status` VARCHAR(30) NOT NULL,
    `applicantId` INTEGER NOT NULL,

    INDEX `recomendations_applicantId_idx`(`applicantId`),
    UNIQUE INDEX `recomendations_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `answers_questionId_idx` ON `answers`(`questionId`);

-- CreateIndex
CREATE UNIQUE INDEX `answers_applicantId_questionId_key` ON `answers`(`applicantId`, `questionId`);

-- AddForeignKey
ALTER TABLE `answers` ADD CONSTRAINT `answers_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `questions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `responses` ADD CONSTRAINT `responses_applicantId_fkey` FOREIGN KEY (`applicantId`) REFERENCES `applicants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `responses` ADD CONSTRAINT `responses_questionnaireId_fkey` FOREIGN KEY (`questionnaireId`) REFERENCES `questionnaires`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recomendations` ADD CONSTRAINT `recomendations_applicantId_fkey` FOREIGN KEY (`applicantId`) REFERENCES `applicants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
