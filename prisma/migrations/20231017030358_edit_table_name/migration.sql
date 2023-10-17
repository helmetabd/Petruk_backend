/*
  Warnings:

  - You are about to drop the `test_question` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_testtotest_question` DROP FOREIGN KEY `_TestToTest_Question_B_fkey`;

-- DropTable
DROP TABLE `test_question`;

-- CreateTable
CREATE TABLE `questions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` VARCHAR(255) NOT NULL,
    `type` ENUM('LongText', 'Text', 'Number', 'Option') NOT NULL DEFAULT 'Option',

    UNIQUE INDEX `questions_question_key`(`question`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_TestToTest_Question` ADD CONSTRAINT `_TestToTest_Question_B_fkey` FOREIGN KEY (`B`) REFERENCES `questions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
