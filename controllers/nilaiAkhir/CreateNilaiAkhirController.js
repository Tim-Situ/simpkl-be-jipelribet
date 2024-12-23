const BaseResponse = require("../../dto/BaseResponse");
var Joi = require("joi");

var nilaiAkhirService = require("../../services/NilaiAkhir");
var kelompokBimbinganService = require("../../services/KelompokBimbingan");
var aspekPenilaianService = require("../../services/AspekPenilaian");
var guruPembimbingService = require("../../services/GuruPembimbing");
var siswaService = require("../../services/Siswa");

async function handler(req, res) {
  var result = new BaseResponse();

  var schema = Joi.object({
    id_siswa: Joi.string().required(),
    data: Joi.array().items(
      Joi.object({
        id_aspek_penilaian: Joi.string().required(),
        nilai: Joi.number().integer().min(0).max(100).required(),
        keterangan: Joi.string().required(),
      })
    ),
  });

  var { error, value } = schema.validate(req.body);

  if (error) {
    result.success = false;
    result.message = error.message;
    result.data = error.stack;
    return res.status(400).json(result);
  }

  var { id_siswa, data } = value;
  var id_guru_pembimbing;

  var cekSiswa = await siswaService.findOne({
    id: id_siswa,
  });

  if (!cekSiswa.success) {
    result.success = false;
    result.message = "Data siswa tidak terdaftar...";
    return res.status(400).json(result);
  }

  for (let i = 0; i < data.length; i++) {
    var cekAspekPenilaian = await aspekPenilaianService.findOne({
      id: data[i].id_aspek_penilaian,
    });

    if (!cekAspekPenilaian.success) {
      result.success = false;
      result.message = "Salah satu data aspek penilaian tidak ditemukan...";
      return res.status(400).json(result);
    }
  }

  // Revisi: pengecekan guru pembimbing di kelompok bimbingan
  var cekGuruPembimbing = await guruPembimbingService.findOne({
    nip: req.username,
  });

  if (cekGuruPembimbing.success) {
    id_guru_pembimbing = cekGuruPembimbing.data.id;
  } else {
    result.success = false;
    result.message = "Terjadi kesalahan di sistem...";
    return res.status(500).json(result);
  }

  var cekAksesGuruPembimbing = await kelompokBimbinganService.findOne({
    id_siswa: id_siswa,
    id_guru_pembimbing: id_guru_pembimbing,
  });

  if (!cekAksesGuruPembimbing.success) {
    result.success = false;
    result.message =
      "Anda tidak memiliki akses untuk menambahkan nilai kelompok bimbingan ini...";
    return res.status(403).json(result);
  }

  var newNilaiAkhir = await nilaiAkhirService.createBulk({
    id_siswa,
    nilaiAkhir: data,
    createdBy: req.username,
  });

  if (newNilaiAkhir.success) {
    result.message = "Nilai akhir berhasil ditambahkan...";
    result.data = newNilaiAkhir.data;
    res.status(201).json(result);
  } else {
    result.success = false;
    result.message = "Internal Server Error";
    res.status(500).json(result);
  }
}

module.exports = handler;
