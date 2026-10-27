-- DropIndex
DROP INDEX `Conseil_parcelleId_fkey` ON `conseil`;

-- DropIndex
DROP INDEX `Culture_userId_fkey` ON `culture`;

-- DropIndex
DROP INDEX `CycleCulture_cultureId_fkey` ON `cycleculture`;

-- DropIndex
DROP INDEX `CycleCulture_parcelleId_fkey` ON `cycleculture`;

-- DropIndex
DROP INDEX `Meteo_parcelleId_fkey` ON `meteo`;

-- DropIndex
DROP INDEX `Parcelle_userId_fkey` ON `parcelle`;

-- DropIndex
DROP INDEX `Releve_cycleCultureId_fkey` ON `releve`;

-- AddForeignKey
ALTER TABLE `Parcelle` ADD CONSTRAINT `Parcelle_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Culture` ADD CONSTRAINT `Culture_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

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
