-- DropForeignKey
ALTER TABLE `jobs` DROP FOREIGN KEY `jobs_authorId_fkey`;

-- AddForeignKey
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
