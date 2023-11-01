-- CreateTable
CREATE TABLE `answers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(255) NOT NULL,
    `applicantId` INTEGER NOT NULL,
    `questionnaireId` INTEGER NOT NULL,

    UNIQUE INDEX `answers_questionnaireId_key`(`questionnaireId`),
    INDEX `answers_applicantId_idx`(`applicantId`),
    INDEX `answers_questionnaireId_idx`(`questionnaireId`),
    UNIQUE INDEX `answers_applicantId_questionnaireId_key`(`applicantId`, `questionnaireId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `answers` ADD CONSTRAINT `answers_applicantId_fkey` FOREIGN KEY (`applicantId`) REFERENCES `applicants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `answers` ADD CONSTRAINT `answers_questionnaireId_fkey` FOREIGN KEY (`questionnaireId`) REFERENCES `questionnaires`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
