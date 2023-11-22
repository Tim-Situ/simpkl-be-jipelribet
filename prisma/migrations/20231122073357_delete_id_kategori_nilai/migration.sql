/*
  Warnings:

  - You are about to drop the column `id_kategori_nilai` on the `aspek_penilaian` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `aspek_penilaian_id_kategori_nilai_fkey` ON `aspek_penilaian`;

-- AlterTable
ALTER TABLE `aspek_penilaian` DROP COLUMN `id_kategori_nilai`;
