/*
  Warnings:

  - You are about to drop the column `enrollment_year` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `graduation_year` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `major` on the `courses` table. All the data in the column will be lost.
  - Added the required column `end_course` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_course` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `qualification` on the `courses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `courses` DROP COLUMN `enrollment_year`,
    DROP COLUMN `graduation_year`,
    DROP COLUMN `major`,
    ADD COLUMN `end_course` DATE NOT NULL,
    ADD COLUMN `start_course` DATE NOT NULL,
    MODIFY `type` VARCHAR(255) NOT NULL,
    DROP COLUMN `qualification`,
    ADD COLUMN `qualification` VARCHAR(10) NOT NULL;
