/*
  Warnings:

  - You are about to drop the `kategori_nilai` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `kode` to the `aspek_penilaian` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `aspek_penilaian` DROP FOREIGN KEY `aspek_penilaian_id_kategori_nilai_fkey`;

-- AlterTable
ALTER TABLE `aspek_penilaian` ADD COLUMN `kode` CHAR(1) NOT NULL;

-- DropTable
DROP TABLE `kategori_nilai`;
