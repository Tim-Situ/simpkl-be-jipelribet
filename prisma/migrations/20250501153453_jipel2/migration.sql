-- DropForeignKey
ALTER TABLE "admin_sekolah" DROP CONSTRAINT "admin_sekolah_username_fkey";

-- DropForeignKey
ALTER TABLE "guru_pembimbing" DROP CONSTRAINT "guru_pembimbing_nip_fkey";

-- DropForeignKey
ALTER TABLE "instruktur" DROP CONSTRAINT "instruktur_username_fkey";

-- DropForeignKey
ALTER TABLE "perusahaan" DROP CONSTRAINT "perusahaan_username_fkey";

-- DropForeignKey
ALTER TABLE "siswa" DROP CONSTRAINT "siswa_nisn_fkey";

-- DropIndex
DROP INDEX "guru_pembimbing_nip_key";

-- DropIndex
DROP INDEX "instruktur_username_key";

-- DropIndex
DROP INDEX "perusahaan_username_key";

-- DropIndex
DROP INDEX "siswa_nisn_key";

-- DropIndex
DROP INDEX "user_username_key";
