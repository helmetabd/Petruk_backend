/*
  Warnings:

  - A unique constraint covering the columns `[testId]` on the table `jobs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `testId` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `jobs` ADD COLUMN `testId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Test_Question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Test_Question_question_key`(`question`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,

    UNIQUE INDEX `tests_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_TestToTest_Question` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_TestToTest_Question_AB_unique`(`A`, `B`),
    INDEX `_TestToTest_Question_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `jobs_testId_key` ON `jobs`(`testId`);

-- AddForeignKey
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `tests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TestToTest_Question` ADD CONSTRAINT `_TestToTest_Question_A_fkey` FOREIGN KEY (`A`) REFERENCES `tests`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TestToTest_Question` ADD CONSTRAINT `_TestToTest_Question_B_fkey` FOREIGN KEY (`B`) REFERENCES `Test_Question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
