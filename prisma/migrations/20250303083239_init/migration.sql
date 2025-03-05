-- CreateEnum
CREATE TYPE "RoleUser" AS ENUM ('Admin Sekolah', 'Pembimbing', 'Siswa', 'Instruktur', 'Perusahaan', 'Orang Tua');

-- CreateEnum
CREATE TYPE "EnumAbsensi" AS ENUM ('Hadir', 'Libur', 'Sakit', 'Alpa', 'Izin');

-- CreateEnum
CREATE TYPE "EnumStatusPerusahaan" AS ENUM ('Aktif', 'Non Aktif', 'Pending', 'Reject');

-- CreateEnum
CREATE TYPE "EnumStatusJurnal" AS ENUM ('Menunggu', 'Ditolak', 'Diterima');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" TEXT NOT NULL,
    "temp_password" TEXT,
    "role" "RoleUser" NOT NULL,
    "refresh_token" TEXT,
    "message_token" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_sekolah" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "alamat" TEXT NOT NULL,
    "no_hp" VARCHAR(20) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_sekolah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "siswa" (
    "id" TEXT NOT NULL,
    "id_jurusan" TEXT NOT NULL,
    "nis" VARCHAR(50) NOT NULL,
    "nisn" VARCHAR(50) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "alamat" TEXT NOT NULL,
    "no_hp" VARCHAR(20) NOT NULL,
    "tempat_lahir" VARCHAR(100) NOT NULL,
    "tanggal_lahir" DATE NOT NULL,
    "status_aktif" BOOLEAN NOT NULL DEFAULT true,
    "foto" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "siswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guru_pembimbing" (
    "id" TEXT NOT NULL,
    "nip" VARCHAR(50) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "alamat" TEXT NOT NULL,
    "no_hp" VARCHAR(25) NOT NULL,
    "status_aktif" BOOLEAN NOT NULL DEFAULT true,
    "foto" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guru_pembimbing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instruktur" (
    "id" TEXT NOT NULL,
    "id_perusahaan" TEXT NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "no_hp" VARCHAR(25) NOT NULL,
    "status_aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "instruktur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perusahaan" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "nama_perusahaan" VARCHAR(100) NOT NULL,
    "pimpinan" VARCHAR(100) NOT NULL,
    "alamat" TEXT NOT NULL,
    "no_hp" VARCHAR(25) NOT NULL,
    "email" TEXT,
    "website" TEXT,
    "status" "EnumStatusPerusahaan" NOT NULL DEFAULT 'Pending',
    "foto" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "perusahaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jurusan" (
    "id" TEXT NOT NULL,
    "bidang_keahlian" VARCHAR(225) NOT NULL,
    "program_keahlian" VARCHAR(225) NOT NULL,
    "kompetensi_keahlian" VARCHAR(225) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jurusan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kelompok_bimbingan" (
    "id" TEXT NOT NULL,
    "id_siswa" TEXT NOT NULL,
    "id_guru_pembimbing" TEXT NOT NULL,
    "id_instruktur" TEXT,
    "id_perusahaan" TEXT NOT NULL,
    "id_tahun_ajaran" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kelompok_bimbingan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nilai_akhir" (
    "id" TEXT NOT NULL,
    "id_siswa" TEXT NOT NULL,
    "id_aspek_penilaian" TEXT NOT NULL,
    "nilai" INTEGER NOT NULL,
    "keterangan" TEXT NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nilai_akhir_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aspek_penilaian" (
    "id" TEXT NOT NULL,
    "judul" VARCHAR(100) NOT NULL,
    "kode" CHAR(1),
    "kelompok_penilaian" VARCHAR(100) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aspek_penilaian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nilai_bulanan" (
    "id" TEXT NOT NULL,
    "id_tujuan_pembelajaran" TEXT NOT NULL,
    "id_bimbingan" TEXT NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "nilai" INTEGER NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nilai_bulanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tujuan_pembelajaran" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tujuan_pembelajaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tahun_ajaran" (
    "id" TEXT NOT NULL,
    "tahun_ajaran" VARCHAR(100) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tahun_ajaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jurnal_harian" (
    "id" TEXT NOT NULL,
    "id_bimbingan" TEXT NOT NULL,
    "hari" VARCHAR(10) NOT NULL,
    "tanggal" DATE NOT NULL,
    "jenis_pekerjaan" TEXT,
    "deskripsi_pekerjaan" TEXT NOT NULL,
    "bentuk_kegiatan" TEXT,
    "jam_mulai" TIME NOT NULL,
    "jam_selesai" TIME NOT NULL,
    "staf" VARCHAR(100) NOT NULL,
    "foto" TEXT NOT NULL,
    "catatan_instruktur" TEXT,
    "catatan_pembimbing" TEXT,
    "status" "EnumStatusJurnal" DEFAULT 'Menunggu',
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jurnal_harian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jurnal_bulanan" (
    "id" TEXT NOT NULL,
    "id_bimbingan" TEXT NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "nama_pekerjaan" TEXT,
    "uraian" TEXT NOT NULL,
    "foto" TEXT NOT NULL,
    "catatan_instruktur" TEXT,
    "catatan_pembimbing" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jurnal_bulanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "absensi" (
    "id" TEXT NOT NULL,
    "id_bimbingan" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "status" "EnumAbsensi" NOT NULL DEFAULT 'Alpa',
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "absensi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banner" (
    "id" TEXT NOT NULL,
    "gambar" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artikel" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "artikel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengumuman" (
    "id" TEXT NOT NULL,
    "pengumuman" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pengumuman_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "admin_sekolah_username_key" ON "admin_sekolah"("username");

-- CreateIndex
CREATE UNIQUE INDEX "siswa_nisn_key" ON "siswa"("nisn");

-- CreateIndex
CREATE UNIQUE INDEX "guru_pembimbing_nip_key" ON "guru_pembimbing"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "instruktur_username_key" ON "instruktur"("username");

-- CreateIndex
CREATE UNIQUE INDEX "perusahaan_username_key" ON "perusahaan"("username");

-- AddForeignKey
ALTER TABLE "admin_sekolah" ADD CONSTRAINT "admin_sekolah_username_fkey" FOREIGN KEY ("username") REFERENCES "user"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswa" ADD CONSTRAINT "siswa_nisn_fkey" FOREIGN KEY ("nisn") REFERENCES "user"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswa" ADD CONSTRAINT "siswa_id_jurusan_fkey" FOREIGN KEY ("id_jurusan") REFERENCES "jurusan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guru_pembimbing" ADD CONSTRAINT "guru_pembimbing_nip_fkey" FOREIGN KEY ("nip") REFERENCES "user"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instruktur" ADD CONSTRAINT "instruktur_username_fkey" FOREIGN KEY ("username") REFERENCES "user"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instruktur" ADD CONSTRAINT "instruktur_id_perusahaan_fkey" FOREIGN KEY ("id_perusahaan") REFERENCES "perusahaan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perusahaan" ADD CONSTRAINT "perusahaan_username_fkey" FOREIGN KEY ("username") REFERENCES "user"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelompok_bimbingan" ADD CONSTRAINT "kelompok_bimbingan_id_siswa_fkey" FOREIGN KEY ("id_siswa") REFERENCES "siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelompok_bimbingan" ADD CONSTRAINT "kelompok_bimbingan_id_guru_pembimbing_fkey" FOREIGN KEY ("id_guru_pembimbing") REFERENCES "guru_pembimbing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelompok_bimbingan" ADD CONSTRAINT "kelompok_bimbingan_id_instruktur_fkey" FOREIGN KEY ("id_instruktur") REFERENCES "instruktur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelompok_bimbingan" ADD CONSTRAINT "kelompok_bimbingan_id_perusahaan_fkey" FOREIGN KEY ("id_perusahaan") REFERENCES "perusahaan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelompok_bimbingan" ADD CONSTRAINT "kelompok_bimbingan_id_tahun_ajaran_fkey" FOREIGN KEY ("id_tahun_ajaran") REFERENCES "tahun_ajaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai_akhir" ADD CONSTRAINT "nilai_akhir_id_siswa_fkey" FOREIGN KEY ("id_siswa") REFERENCES "siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai_akhir" ADD CONSTRAINT "nilai_akhir_id_aspek_penilaian_fkey" FOREIGN KEY ("id_aspek_penilaian") REFERENCES "aspek_penilaian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai_bulanan" ADD CONSTRAINT "nilai_bulanan_id_bimbingan_fkey" FOREIGN KEY ("id_bimbingan") REFERENCES "kelompok_bimbingan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai_bulanan" ADD CONSTRAINT "nilai_bulanan_id_tujuan_pembelajaran_fkey" FOREIGN KEY ("id_tujuan_pembelajaran") REFERENCES "tujuan_pembelajaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jurnal_harian" ADD CONSTRAINT "jurnal_harian_id_bimbingan_fkey" FOREIGN KEY ("id_bimbingan") REFERENCES "kelompok_bimbingan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jurnal_bulanan" ADD CONSTRAINT "jurnal_bulanan_id_bimbingan_fkey" FOREIGN KEY ("id_bimbingan") REFERENCES "kelompok_bimbingan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "absensi" ADD CONSTRAINT "absensi_id_bimbingan_fkey" FOREIGN KEY ("id_bimbingan") REFERENCES "kelompok_bimbingan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
