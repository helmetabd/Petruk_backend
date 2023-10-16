-- AlterTable
ALTER TABLE `expectations` MODIFY `salary_expectation` VARCHAR(10) NOT NULL;

-- CreateTable
CREATE TABLE `courses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `instance_name` VARCHAR(255) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `major` VARCHAR(255) NOT NULL,
    `qualification` DOUBLE NOT NULL,
    `enrollment_year` DATE NOT NULL,
    `graduation_year` DATE NOT NULL,

    UNIQUE INDEX `courses_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `courses` ADD CONSTRAINT `courses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
