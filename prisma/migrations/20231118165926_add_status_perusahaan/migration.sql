-- AlterTable
ALTER TABLE `perusahaan` ADD COLUMN `status` ENUM('Aktif', 'Non Aktif', 'Pending', 'Reject') NOT NULL DEFAULT 'Pending';
