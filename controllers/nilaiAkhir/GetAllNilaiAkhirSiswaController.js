const BaseResponse = require("../../dto/BaseResponse");

var nilaiAkhirService = require("../../services/NilaiAkhir");
var siswaService = require("../../services/Siswa");

async function handler(req, res) {
  var result = new BaseResponse();

  var cekSiswa = await siswaService.findOne({
    nisn: req.username,
  });

  var orderBy = { id: "asc" };
  var include = {
    aspek_penilaian: true,
  };

  var nilaiAkhir = await nilaiAkhirService.getAll({}, orderBy, include);

  if (nilaiAkhir.success && nilaiAkhir.data.length === 0) {
    result.message = "Data nilai akhir belum tersedia...";
    result.data = nilaiAkhir.data;
    return res.status(400).json(result);
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
