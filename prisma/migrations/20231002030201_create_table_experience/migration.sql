-- CreateTable
CREATE TABLE `experiences` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `instance_name` VARCHAR(255) NOT NULL,
    `position` VARCHAR(100) NOT NULL,
    `start_work` DATE NOT NULL,
    `end_work` DATE NOT NULL,

    UNIQUE INDEX `experiences_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `experiences` ADD CONSTRAINT `experiences_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
