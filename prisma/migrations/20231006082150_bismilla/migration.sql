/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `jobs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `jobs_id_key` ON `jobs`(`id`);
