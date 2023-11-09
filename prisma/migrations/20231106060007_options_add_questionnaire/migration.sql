-- AlterTable
ALTER TABLE `applicants` MODIFY `status` ENUM('Submitted', 'Interview', 'Hold', 'Placed', 'Rejected') NOT NULL;

-- CreateTable
CREATE TABLE `_OptionsToQuestionnaire` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_OptionsToQuestionnaire_AB_unique`(`A`, `B`),
    INDEX `_OptionsToQuestionnaire_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_OptionsToQuestionnaire` ADD CONSTRAINT `_OptionsToQuestionnaire_A_fkey` FOREIGN KEY (`A`) REFERENCES `options`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OptionsToQuestionnaire` ADD CONSTRAINT `_OptionsToQuestionnaire_B_fkey` FOREIGN KEY (`B`) REFERENCES `questionnaires`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
