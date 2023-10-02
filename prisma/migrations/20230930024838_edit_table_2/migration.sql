/*
  Warnings:

  - You are about to alter the column `education_level` on the `educations` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE `educations` MODIFY `education_level` VARCHAR(50) NOT NULL;
