-- DropForeignKey
ALTER TABLE `jobs` DROP FOREIGN KEY `jobs_authorId_fkey`;

-- AlterTable
ALTER TABLE `jobs` MODIFY `authorId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;
