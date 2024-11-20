-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `temp_password` VARCHAR(191) NULL,
    `role` ENUM('Admin Sekolah', 'Pembimbing', 'Siswa', 'Instruktur', 'Perusahaan', 'Orang Tua') NOT NULL,
    `refresh_token` TEXT NULL,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_sekolah` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `alamat` TEXT NOT NULL,
    `no_hp` VARCHAR(20) NOT NULL,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `admin_sekolah_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `siswa` (
    `id` VARCHAR(191) NOT NULL,
    `id_jurusan` VARCHAR(191) NOT NULL,
    `nis` VARCHAR(50) NOT NULL,
    `nisn` VARCHAR(50) NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `alamat` TEXT NOT NULL,
    `no_hp` VARCHAR(20) NOT NULL,
    `tempat_lahir` VARCHAR(100) NOT NULL,
    `tanggal_lahir` DATE NOT NULL,
    `status_aktif` BOOLEAN NOT NULL DEFAULT true,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `siswa_nisn_key`(`nisn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guru_pembimbing` (
    `id` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(50) NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `alamat` TEXT NOT NULL,
    `no_hp` VARCHAR(25) NOT NULL,
    `status_aktif` BOOLEAN NOT NULL DEFAULT true,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `guru_pembimbing_nip_key`(`nip`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `instruktur` (
    `id` VARCHAR(191) NOT NULL,
    `id_perusahaan` VARCHAR(191) NOT NULL,
    `username` VARCHAR(20) NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `no_hp` VARCHAR(25) NOT NULL,
    `status_aktif` BOOLEAN NOT NULL DEFAULT true,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `instruktur_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perusahaan` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(20) NOT NULL,
    `nama_perusahaan` VARCHAR(100) NOT NULL,
    `pimpinan` VARCHAR(100) NOT NULL,
    `alamat` TEXT NOT NULL,
    `no_hp` VARCHAR(25) NOT NULL,
    `email` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `status` ENUM('Aktif', 'Non Aktif', 'Pending', 'Reject') NOT NULL DEFAULT 'Pending',
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `perusahaan_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jurusan` (
    `id` VARCHAR(191) NOT NULL,
    `bidang_keahlian` VARCHAR(225) NOT NULL,
    `program_keahlian` VARCHAR(225) NOT NULL,
    `kompetensi_keahlian` VARCHAR(225) NOT NULL,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kelompok_bimbingan` (
    `id` VARCHAR(191) NOT NULL,
    `id_siswa` VARCHAR(191) NOT NULL,
    `id_guru_pembimbing` VARCHAR(191) NOT NULL,
    `id_instruktur` VARCHAR(191) NULL,
    `id_perusahaan` VARCHAR(191) NOT NULL,
    `id_tahun_ajaran` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nilai_akhir` (
    `id` VARCHAR(191) NOT NULL,
    `id_siswa` VARCHAR(191) NOT NULL,
    `id_aspek_penilaian` VARCHAR(191) NOT NULL,
    `nilai` INTEGER NOT NULL,
    `keterangan` TEXT NOT NULL,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aspek_penilaian` (
    `id` VARCHAR(191) NOT NULL,
    `judul` VARCHAR(100) NOT NULL,
    `kode` CHAR(1) NULL,
    `kelompok_penilaian` VARCHAR(100) NOT NULL,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nilai_bulanan` (
    `id` VARCHAR(191) NOT NULL,
    `id_tujuan_pembelajaran` VARCHAR(191) NOT NULL,
    `id_bimbingan` VARCHAR(191) NOT NULL,
    `bulan` INTEGER NOT NULL,
    `tahun` INTEGER NOT NULL,
    `nilai` INTEGER NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tujuan_pembelajaran` (
    `id` VARCHAR(191) NOT NULL,
    `judul` TEXT NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tahun_ajaran` (
    `id` VARCHAR(191) NOT NULL,
    `tahun_ajaran` VARCHAR(100) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jurnal_harian` (
    `id` VARCHAR(191) NOT NULL,
    `id_bimbingan` VARCHAR(191) NOT NULL,
    `hari` VARCHAR(10) NOT NULL,
    `tanggal` DATE NOT NULL,
    `jenis_pekerjaan` TEXT NULL,
    `deskripsi_pekerjaan` TEXT NOT NULL,
    `bentuk_kegiatan` TEXT NULL,
    `jam_mulai` TIME NOT NULL,
    `jam_selesai` TIME NOT NULL,
    `staf` VARCHAR(100) NOT NULL,
    `foto` TEXT NOT NULL,
    `catatan_instruktur` TEXT NULL,
    `catatan_pembimbing` TEXT NULL,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jurnal_bulanan` (
    `id` VARCHAR(191) NOT NULL,
    `id_bimbingan` VARCHAR(191) NOT NULL,
    `bulan` INTEGER NOT NULL,
    `tahun` INTEGER NOT NULL,
    `nama_pekerjaan` TEXT NULL,
    `uraian` TEXT NOT NULL,
    `foto` TEXT NOT NULL,
    `catatan_instruktur` TEXT NULL,
    `catatan_pembimbing` TEXT NULL,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `absensi` (
    `id` VARCHAR(191) NOT NULL,
    `id_bimbingan` VARCHAR(191) NOT NULL,
    `tanggal` DATE NOT NULL,
    `status` ENUM('Hadir', 'Libur', 'Sakit', 'Alpa', 'Izin') NOT NULL DEFAULT 'Alpa',
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `admin_sekolah` ADD CONSTRAINT `admin_sekolah_username_fkey` FOREIGN KEY (`username`) REFERENCES `user`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `siswa` ADD CONSTRAINT `siswa_nisn_fkey` FOREIGN KEY (`nisn`) REFERENCES `user`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `siswa` ADD CONSTRAINT `siswa_id_jurusan_fkey` FOREIGN KEY (`id_jurusan`) REFERENCES `jurusan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guru_pembimbing` ADD CONSTRAINT `guru_pembimbing_nip_fkey` FOREIGN KEY (`nip`) REFERENCES `user`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `instruktur` ADD CONSTRAINT `instruktur_username_fkey` FOREIGN KEY (`username`) REFERENCES `user`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `instruktur` ADD CONSTRAINT `instruktur_id_perusahaan_fkey` FOREIGN KEY (`id_perusahaan`) REFERENCES `perusahaan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `perusahaan` ADD CONSTRAINT `perusahaan_username_fkey` FOREIGN KEY (`username`) REFERENCES `user`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelompok_bimbingan` ADD CONSTRAINT `kelompok_bimbingan_id_siswa_fkey` FOREIGN KEY (`id_siswa`) REFERENCES `siswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelompok_bimbingan` ADD CONSTRAINT `kelompok_bimbingan_id_guru_pembimbing_fkey` FOREIGN KEY (`id_guru_pembimbing`) REFERENCES `guru_pembimbing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelompok_bimbingan` ADD CONSTRAINT `kelompok_bimbingan_id_instruktur_fkey` FOREIGN KEY (`id_instruktur`) REFERENCES `instruktur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelompok_bimbingan` ADD CONSTRAINT `kelompok_bimbingan_id_perusahaan_fkey` FOREIGN KEY (`id_perusahaan`) REFERENCES `perusahaan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelompok_bimbingan` ADD CONSTRAINT `kelompok_bimbingan_id_tahun_ajaran_fkey` FOREIGN KEY (`id_tahun_ajaran`) REFERENCES `tahun_ajaran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nilai_akhir` ADD CONSTRAINT `nilai_akhir_id_siswa_fkey` FOREIGN KEY (`id_siswa`) REFERENCES `siswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nilai_akhir` ADD CONSTRAINT `nilai_akhir_id_aspek_penilaian_fkey` FOREIGN KEY (`id_aspek_penilaian`) REFERENCES `aspek_penilaian`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nilai_bulanan` ADD CONSTRAINT `nilai_bulanan_id_bimbingan_fkey` FOREIGN KEY (`id_bimbingan`) REFERENCES `kelompok_bimbingan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nilai_bulanan` ADD CONSTRAINT `nilai_bulanan_id_tujuan_pembelajaran_fkey` FOREIGN KEY (`id_tujuan_pembelajaran`) REFERENCES `tujuan_pembelajaran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jurnal_harian` ADD CONSTRAINT `jurnal_harian_id_bimbingan_fkey` FOREIGN KEY (`id_bimbingan`) REFERENCES `kelompok_bimbingan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jurnal_bulanan` ADD CONSTRAINT `jurnal_bulanan_id_bimbingan_fkey` FOREIGN KEY (`id_bimbingan`) REFERENCES `kelompok_bimbingan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `absensi` ADD CONSTRAINT `absensi_id_bimbingan_fkey` FOREIGN KEY (`id_bimbingan`) REFERENCES `kelompok_bimbingan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
