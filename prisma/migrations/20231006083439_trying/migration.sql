/*
  Warnings:

  - You are about to alter the column `authorId` on the `jobs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `jobs` DROP FOREIGN KEY `jobs_authorId_fkey`;

-- DropIndex
DROP INDEX `jobs_id_key` ON `jobs`;

-- AlterTable
ALTER TABLE `jobs` MODIFY `authorId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
