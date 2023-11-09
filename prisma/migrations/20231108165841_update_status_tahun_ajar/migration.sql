/*
  Warnings:

  - You are about to alter the column `status` on the `tahun_ajaran` table. The data in that column could be lost. The data in that column will be cast from `Text` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `tahun_ajaran` MODIFY `status` BOOLEAN NOT NULL DEFAULT false;
