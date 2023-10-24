-- DropIndex
DROP INDEX `educations_education_level_key` ON `educations`;

-- DropIndex
DROP INDEX `educations_instance_name_key` ON `educations`;

-- CreateIndex
CREATE INDEX `educations_userId_instance_name_education_level_idx` ON `educations`(`userId`, `instance_name`, `education_level`);
