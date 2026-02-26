-- DropIndex
DROP INDEX `Soldier_cpf_idx` ON `Soldier`;

-- AlterTable
ALTER TABLE `FATD` MODIFY `reason` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Soldier` MODIFY `familyHistory` TEXT NULL,
    MODIFY `professionalExp` TEXT NULL,
    MODIFY `notesPositive` TEXT NULL,
    MODIFY `notesNegative` TEXT NULL;

-- CreateTable
CREATE TABLE `FO` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` ENUM('POSITIVO', 'NEGATIVO') NOT NULL,
    `text` TEXT NOT NULL,
    `soldierId` VARCHAR(191) NOT NULL,

    INDEX `FO_soldierId_idx`(`soldierId`),
    INDEX `FO_date_idx`(`date`),
    INDEX `FO_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `FATD_date_idx` ON `FATD`(`date`);

-- CreateIndex
CREATE INDEX `Soldier_platoon_idx` ON `Soldier`(`platoon`);

-- AddForeignKey
ALTER TABLE `FO` ADD CONSTRAINT `FO_soldierId_fkey` FOREIGN KEY (`soldierId`) REFERENCES `Soldier`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `FATD` RENAME INDEX `FATD_soldierId_fkey` TO `FATD_soldierId_idx`;
