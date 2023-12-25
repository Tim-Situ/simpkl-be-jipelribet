/*
  Warnings:

  - Added the required column `kelompok_penilaian` to the `aspek_penilaian` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `aspek_penilaian` ADD COLUMN `kelompok_penilaian` VARCHAR(100) NOT NULL,
    MODIFY `kode` CHAR(1) NULL;
