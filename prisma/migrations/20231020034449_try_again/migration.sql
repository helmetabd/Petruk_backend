/*
  Warnings:

  - A unique constraint covering the columns `[instance_name]` on the table `educations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[education_level]` on the table `educations` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `educations_userId_instance_name_education_level_idx` ON `educations`;

-- CreateIndex
CREATE UNIQUE INDEX `educations_instance_name_key` ON `educations`(`instance_name`);

-- CreateIndex
CREATE UNIQUE INDEX `educations_education_level_key` ON `educations`(`education_level`);
