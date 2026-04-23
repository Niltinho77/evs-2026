-- DropIndex
DROP INDEX `Soldier_cpf_key` ON `Soldier`;

-- DropIndex
DROP INDEX `Soldier_idt_key` ON `Soldier`;

-- AlterTable
ALTER TABLE `Soldier` ADD COLUMN `altura` INTEGER NULL,
    ADD COLUMN `cabelo` VARCHAR(191) NULL,
    ADD COLUMN `corOlhos` VARCHAR(191) NULL,
    ADD COLUMN `cutis` VARCHAR(191) NULL,
    ADD COLUMN `doadorOrgaos` BOOLEAN NULL,
    ADD COLUMN `identidadeMilitar` VARCHAR(191) NULL;
