const BaseResponse = require("../../dto/BaseResponse");

var nilaiAkhirService = require("../../services/NilaiAkhir");
var aspekPenilaianService = require("../../services/AspekPenilaian");
var guruPembimbingService = require("../../services/GuruPembimbing");
var kelompokBimbinganService = require("../../services/KelompokBimbingan");

async function handler(req, res) {
  var result = new BaseResponse();

  var dataPembimbing = await guruPembimbingService.findOne({
    nip: req.username,
  });

  if (!dataPembimbing.success) {
    result.success = false;
    result.message = "Terjadi kesalahan dalam sistem...";
    return res.status(500).json(result);
  }

  var where = {
    AND: [{ id_guru_pembimbing: dataPembimbing.data.id }],
  };

  var cekBimbingan = await kelompokBimbinganService.getAll({
    id_guru_pembimbing: dataPembimbing.data.id,
    status: true,
  });

  if (!cekBimbingan.success) {
    result.success = false;
    result.message = "Data kelompok bimbingan tidak ditemukan...";
    return res.status(404).json(result);
  }

  if (!cekBimbingan.data.length > 0) {
    result.success = false;
    result.message = "Tidak ada kelompok bimbingan yang aktif...";
    return res.status(400).json(result);
  }

  filteredSiswa = [];
  cekBimbingan.data.forEach((data) => {
    filteredSiswa.push(data.id_siswa);
  });

  var where = {
    OR: filteredSiswa.map((id) => {
      return { id_siswa: id };
    }),
  };

  var oderBy = {};

  var include = {
    aspek_penilaian: true,
  };

  var nilaiAkhir = await nilaiAkhirService.getAll(where, oderBy, include);

  if (nilaiAkhir.success && nilaiAkhir.data.length === 0) {
    var dataNilai = [];

    var aspekPenilaian = await aspekPenilaianService.getAll();

    aspekPenilaian.data.forEach((data) => {
      if (!filteredSiswa.includes(data.id_siswa)) {
        dataNilai.push({
          id: data.id,
          judul: data.judul,
          kode: data.kode,
          kelompok_penilaian: data.kelompok_penilaian,
          nilai_akhir: 0,
        });
      }
    });

    result.message = "Data nilai akhir masih kosong...";
    result.data = dataNilai;
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
