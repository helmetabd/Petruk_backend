-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('USER', 'ADMIN', 'SUPER') NOT NULL DEFAULT 'USER';