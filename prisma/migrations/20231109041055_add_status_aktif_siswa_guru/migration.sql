-- AlterTable
ALTER TABLE `guru_pembimbing` ADD COLUMN `status_aktif` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `siswa` ADD COLUMN `status_aktif` BOOLEAN NOT NULL DEFAULT true;
