-- CreateTable
CREATE TABLE `VideosCategory` (
    `id` VARCHAR(191) NOT NULL,
    `adminUserId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `VideosCategory_id_key`(`id`),
    INDEX `AdminUserIdIndex`(`adminUserId`),
    INDEX `NameIndex`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Videos` (
    `id` VARCHAR(191) NOT NULL,
    `adminUserId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `type` INTEGER NULL DEFAULT 1,
    `categoryId` VARCHAR(191) NOT NULL,
    `videoLink` TEXT NOT NULL,
    `description` TEXT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Videos_id_key`(`id`),
    INDEX `AdminUserIdIndex`(`adminUserId`),
    INDEX `CategoryIdIdIndex`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Videos` ADD CONSTRAINT `Videos_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `VideosCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
