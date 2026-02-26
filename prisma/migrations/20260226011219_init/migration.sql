-- CreateTable
CREATE TABLE `Soldier` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `squad` VARCHAR(191) NOT NULL DEFAULT 'Comando',
    `platoon` ENUM('P1', 'P2', 'P3') NULL,
    `photoUrl` VARCHAR(191) NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `warName` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `idt` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `emergencyPhone` VARCHAR(191) NOT NULL,
    `naturalidade` VARCHAR(191) NOT NULL,
    `motherName` VARCHAR(191) NOT NULL,
    `fatherName` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `laranjeira` BOOLEAN NOT NULL DEFAULT false,
    `familyHistory` VARCHAR(191) NULL,
    `professionalExp` VARCHAR(191) NULL,
    `education` VARCHAR(191) NULL,
    `hasLicense` BOOLEAN NOT NULL DEFAULT false,
    `licenseCategory` VARCHAR(191) NULL,
    `bloodType` ENUM('A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG') NULL,
    `bank` ENUM('BANCO_DO_BRASIL', 'CAIXA', 'SANTANDER', 'ITAU', 'NUBANK', 'OUTRO') NULL,
    `agency` VARCHAR(191) NULL,
    `account` VARCHAR(191) NULL,
    `religion` VARCHAR(191) NULL,
    `voterTitle` VARCHAR(191) NULL,
    `isAthlete` BOOLEAN NOT NULL DEFAULT false,
    `physicalActivity` VARCHAR(191) NULL,
    `notesPositive` VARCHAR(191) NULL,
    `notesNegative` VARCHAR(191) NULL,

    UNIQUE INDEX `Soldier_cpf_key`(`cpf`),
    UNIQUE INDEX `Soldier_idt_key`(`idt`),
    INDEX `Soldier_fullName_idx`(`fullName`),
    INDEX `Soldier_warName_idx`(`warName`),
    INDEX `Soldier_cpf_idx`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FATD` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `soldierId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `punishment` ENUM('ADVERTENCIA', 'IMPEDIMENTO', 'REPREENSAO', 'DETENCAO', 'CADEIA') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FATD` ADD CONSTRAINT `FATD_soldierId_fkey` FOREIGN KEY (`soldierId`) REFERENCES `Soldier`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
