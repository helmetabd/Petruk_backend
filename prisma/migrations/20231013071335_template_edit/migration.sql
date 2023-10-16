/*
  Warnings:

  - You are about to drop the column `templateId` on the `jobs` table. All the data in the column will be lost.
  - You are about to drop the `questionnaire` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `template` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_questionnairetotemplate` DROP FOREIGN KEY `_QuestionnaireToTemplate_A_fkey`;

-- DropForeignKey
ALTER TABLE `_questionnairetotemplate` DROP FOREIGN KEY `_QuestionnaireToTemplate_B_fkey`;

-- DropForeignKey
ALTER TABLE `jobs` DROP FOREIGN KEY `jobs_templateId_fkey`;

-- AlterTable
ALTER TABLE `jobs` DROP COLUMN `templateId`;

-- DropTable
DROP TABLE `questionnaire`;

-- DropTable
DROP TABLE `template`;

-- CreateTable
CREATE TABLE `questionnaires` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `questionnaires_question_key`(`question`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `templates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `jobId` INTEGER NOT NULL,

    UNIQUE INDEX `templates_name_key`(`name`),
    UNIQUE INDEX `templates_jobId_key`(`jobId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `templates` ADD CONSTRAINT `templates_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `jobs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_QuestionnaireToTemplate` ADD CONSTRAINT `_QuestionnaireToTemplate_A_fkey` FOREIGN KEY (`A`) REFERENCES `questionnaires`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_QuestionnaireToTemplate` ADD CONSTRAINT `_QuestionnaireToTemplate_B_fkey` FOREIGN KEY (`B`) REFERENCES `templates`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
