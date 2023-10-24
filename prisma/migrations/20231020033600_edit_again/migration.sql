/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `educations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `educations_userId_key` ON `educations`(`userId`);
