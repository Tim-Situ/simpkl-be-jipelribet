const BaseResponse = require("../../dto/BaseResponse");

var nilaiAkhirService = require("../../services/NilaiAkhir");
var aspekPenilaianService = require("../../services/AspekPenilaian");
var guruPembimbingService = require("../../services/GuruPembimbing");
var kelompokBimbinganService = require("../../services/KelompokBimbingan");
var siswaService = require("../../services/Siswa");

async function handler(req, res) {
  var result = new BaseResponse();

  if (!req.query.id_siswa) {
    result.success = false;
    result.message = "Parameter siswa harus diisi...";
    return res.status(400).json(result);
  }

  var id_siswa = req.query.id_siswa;

  var dataPembimbing = await guruPembimbingService.findOne({
    nip: req.username,
  });

  if (!dataPembimbing.success) {
    result.success = false;
    result.message = "Terjadi kesalahan dalam sistem...";
    return res.status(500).json(result);
  }

  var cekSiswa = await siswaService.findOne({
    id: id_siswa,
  });

  if (!cekSiswa.success) {
    result.success = false;
    result.message = "Data siswa tidak ditemukan...";
    return res.status(404).json(result);
  }

  if (!cekSiswa.data.status_aktif) {
    result.success = false;
    result.message = "Siswa sudah tidak aktif...";
    return res.status(400).json(result);
  }

  var cekBimbingan = await kelompokBimbinganService.findOne({
    id_guru_pembimbing: dataPembimbing.data.id,
    id_siswa: cekSiswa.data.id,
  });

  if (cekBimbingan.data.id_guru_pembimbing != dataPembimbing.data.id) {
    result.success = false;
    result.message = "Anda tidak memiliki hak untuk mengakses nilai ini...";
    return res.status(403).json(result);
  }

  var where = {
    AND: [{ id_siswa: cekSiswa.data.id }],
  };

  var orderBy = [];

  var include = {
    aspek_penilaian: true,
  };

  var nilaiAkhir = await nilaiAkhirService.getAll(where, orderBy, include);

  if (nilaiAkhir.success && nilaiAkhir.data.length === 0) {
    var dataNilaiAwal = [];

    var tujuanPembelajaran = await aspekPenilaianService.getAll();

    tujuanPembelajaran.data.forEach((data) => {
      dataNilaiAwal.push({
        id_aspek_penilaian: data.id,
        id_siswa: cekSiswa.data.id,
        nilai: 0,
        keterangan: "Belum ada keterangan",
        kelompok_penilaian: data.kelompok_penilaian,
        aspek_penilaian: data,
      });
    });

    result.message = "Data nilai akhir masih kosong...";
    result.data = dataNilaiAwal;
    return res.status(200).json(result);
  }

  if (nilaiAkhir.success && nilaiAkhir.data.length > 0) {
    result.message = "Data nilai akhir berhasil ditampilkan...";
    result.data = nilaiAkhir.data;
    return res.status(200).json(result);
  } else {
    result.success = false;
    result.message = "Internal Server Error";
    return res.status(500).json(result);
  }
}

module.exports = handler;
