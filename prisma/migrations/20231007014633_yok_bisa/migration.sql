/*
  Warnings:

  - You are about to alter the column `B` on the `_skilltouser` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `Int`.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `_skilltouser` DROP FOREIGN KEY `_SkillToUser_B_fkey`;

-- AlterTable
ALTER TABLE `_skilltouser` MODIFY `B` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `users_username_key` ON `users`(`username`);

-- AddForeignKey
ALTER TABLE `_SkillToUser` ADD CONSTRAINT `_SkillToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
