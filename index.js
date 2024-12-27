const express = require("express");
var cookieParser = require("cookie-parser");
var cors = require("cors");
var dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
  });
}


const app = express();

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "https://simpkl.haululazkiyaa.id"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Route
app.get("/", (req, res) => {
  res.send("Welcome to the homepage!");
});

app.post("/send-notification", async (req, res) => {
  const { token, title, body } = req.body;

  if (!token || !title || !body) {
      return res.status(400).send({ message: "All fields are required." });
  }

  const message = {
      notification: {
          title,
          body,
      },
      token,
  };

  try {
      const response = await admin.messaging().send(message);
      res.status(200).send({ message: "Notification sent!", response });
  } catch (error) {
      res.status(500).send({ message: "Failed to send notification.", error });
  }
});

app.use("/auth", require("./routes/Auth"));
app.use("/tes", require("./routes/Tes"));
app.use("/tahun-ajaran", require("./routes/TahunAjaran"));
app.use("/jurusan", require("./routes/Jurusan"));
app.use("/guru-pembimbing", require("./routes/GuruPembimbing"));
app.use("/siswa", require("./routes/Siswa"));
app.use("/perusahaan", require("./routes/Perusahaan"));
app.use("/instruktur", require("./routes/Instruktur"));
app.use("/kelompok-bimbingan", require("./routes/KelompokBimbingan"));
app.use("/tujuan-pembelajaran", require("./routes/TujuanPembelajaran"));
app.use("/nilai-bulanan", require("./routes/NilaiBulanan"));
app.use("/nilai-akhir", require("./routes/NilaiAkhir"));
app.use("/jurnal-harian", require("./routes/JurnalHarian"));
app.use("/aspek-penilaian", require("./routes/AspekPenilaian"));
app.use("/absensi", require("./routes/Absensi"));
app.use("/banner", require("./routes/Banner"));
app.use("/artikel", require("./routes/Artikel"));
app.use("/pengumuman", require("./routes/Pengumuman"));




app.listen(process.env.APP_PORT, () => {
  console.log("Server up and running: " + process.env.APP_PORT);
});
