-- CreateTable
CREATE TABLE `Parcelle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `superficie` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Culture` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Releve` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `observation` VARCHAR(191) NOT NULL,
    `stade_croissance` VARCHAR(191) NOT NULL,
    `cycleCultureId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CycleCulture` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date_plantation` DATETIME(3) NOT NULL,
    `date_recolte` DATETIME(3) NULL,
    `parcelleId` INTEGER NOT NULL,
    `cultureId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Meteo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `temperature` DOUBLE NOT NULL,
    `humidite` DOUBLE NULL,
    `pluie` DOUBLE NULL,
    `vent` DOUBLE NULL,
    `parcelleId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Conseil` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titre` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `parcelleId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Releve` ADD CONSTRAINT `Releve_cycleCultureId_fkey` FOREIGN KEY (`cycleCultureId`) REFERENCES `CycleCulture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CycleCulture` ADD CONSTRAINT `CycleCulture_parcelleId_fkey` FOREIGN KEY (`parcelleId`) REFERENCES `Parcelle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CycleCulture` ADD CONSTRAINT `CycleCulture_cultureId_fkey` FOREIGN KEY (`cultureId`) REFERENCES `Culture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Meteo` ADD CONSTRAINT `Meteo_parcelleId_fkey` FOREIGN KEY (`parcelleId`) REFERENCES `Parcelle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conseil` ADD CONSTRAINT `Conseil_parcelleId_fkey` FOREIGN KEY (`parcelleId`) REFERENCES `Parcelle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
