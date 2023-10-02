/*
  Warnings:

  - You are about to drop the `blogs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `blogs` DROP FOREIGN KEY `Blog_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `blogs` DROP FOREIGN KEY `Blog_categoryId_fkey`;

-- DropTable
DROP TABLE `blogs`;

-- DropTable
DROP TABLE `categories`;

-- CreateTable
CREATE TABLE `educations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `instance_name` VARCHAR(255) NOT NULL,
    `education_level` VARCHAR(255) NOT NULL,
    `major` VARCHAR(255) NOT NULL,
    `gpa` DOUBLE NOT NULL,
    `enrollment_year` DATE NOT NULL,
    `graduation_year` DATE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `educations_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `skills` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SkillToUser` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `_SkillToUser_AB_unique`(`A`, `B`),
    INDEX `_SkillToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `educations` ADD CONSTRAINT `educations_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SkillToUser` ADD CONSTRAINT `_SkillToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `skills`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SkillToUser` ADD CONSTRAINT `_SkillToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;
