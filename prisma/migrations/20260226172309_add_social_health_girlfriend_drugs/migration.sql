-- AlterTable
ALTER TABLE `Soldier` ADD COLUMN `drugsDetails` TEXT NULL,
    ADD COLUMN `facebook` VARCHAR(191) NULL,
    ADD COLUMN `girlfriendAddress` TEXT NULL,
    ADD COLUMN `hasGirlfriend` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `healthIssues` TEXT NULL,
    ADD COLUMN `instagram` VARCHAR(191) NULL,
    ADD COLUMN `usedDrugs` BOOLEAN NOT NULL DEFAULT false;
