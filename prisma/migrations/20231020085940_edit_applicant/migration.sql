/*
  Warnings:

  - A unique constraint covering the columns `[jobId,userId]` on the table `applicants` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `applicants_jobId_userId_key` ON `applicants`(`jobId`, `userId`);
