/*
  Warnings:

  - A unique constraint covering the columns `[instance_name,userId,education_level]` on the table `educations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `educations_instance_name_userId_education_level_key` ON `educations`(`instance_name`, `userId`, `education_level`);
