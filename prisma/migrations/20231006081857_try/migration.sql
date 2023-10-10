/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `divisions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `positions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `divisions_name_key` ON `divisions`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `positions_name_key` ON `positions`(`name`);
