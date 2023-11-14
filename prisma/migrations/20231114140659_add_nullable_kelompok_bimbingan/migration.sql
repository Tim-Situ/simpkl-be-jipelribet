-- DropForeignKey
ALTER TABLE `kelompok_bimbingan` DROP FOREIGN KEY `kelompok_bimbingan_id_instruktur_fkey`;

-- AlterTable
ALTER TABLE `kelompok_bimbingan` MODIFY `id_instruktur` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `kelompok_bimbingan` ADD CONSTRAINT `kelompok_bimbingan_id_instruktur_fkey` FOREIGN KEY (`id_instruktur`) REFERENCES `instruktur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
