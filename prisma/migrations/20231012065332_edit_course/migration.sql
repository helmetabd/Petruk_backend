/*
  Warnings:

  - A unique constraint covering the columns `[instance_name]` on the table `courses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[type]` on the table `courses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `courses_instance_name_key` ON `courses`(`instance_name`);

-- CreateIndex
CREATE UNIQUE INDEX `courses_type_key` ON `courses`(`type`);
