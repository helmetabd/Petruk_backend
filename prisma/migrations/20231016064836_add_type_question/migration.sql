-- AlterTable
ALTER TABLE `questionnaires` ADD COLUMN `type` ENUM('LongText', 'Text', 'Number', 'Option') NOT NULL DEFAULT 'Text';
