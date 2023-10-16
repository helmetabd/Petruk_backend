/*
  Warnings:

  - A unique constraint covering the columns `[instance_name]` on the table `educations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[education_level]` on the table `educations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[instance_name]` on the table `experiences` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[position]` on the table `experiences` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `family` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `needs` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `jobs` ADD COLUMN `needs` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `educations_instance_name_key` ON `educations`(`instance_name`);

-- CreateIndex
CREATE UNIQUE INDEX `educations_education_level_key` ON `educations`(`education_level`);

-- CreateIndex
CREATE UNIQUE INDEX `experiences_instance_name_key` ON `experiences`(`instance_name`);

-- CreateIndex
CREATE UNIQUE INDEX `experiences_position_key` ON `experiences`(`position`);

-- CreateIndex
CREATE UNIQUE INDEX `family_name_key` ON `family`(`name`);
