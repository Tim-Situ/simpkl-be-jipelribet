var Joi = require("joi")
var bcrypt = require("bcrypt")
var jwt = require("jsonwebtoken") 
const multer = require('multer'); 
const AWS = require('aws-sdk');

const BaseResponse = require("../../dto/BaseResponse")

const s3 = new AWS.S3({
    endpoint: process.env.ENDPOINT,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
});

async function handler(req, res) {
    var result = new BaseResponse()

    if (!req.file) {
        result.success = false
        result.message = "File gambar tidak ditemukan..."
        return res.status(400).json(result)
    }

    const buf = req.file.buffer;

    const params = {
        Bucket: 'tplum/tplum', //nama folder -> tplum/{nama_folder}
        Key: `${Math.floor(Date.now() / 1000)}.png`,
        Body: buf,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: 'image/png',
    };

    s3.upload(params, (s3Err, data) => {
        if (s3Err) {
            result.success = false
            result.message = s3Err
            res.status(500).json(result)
            // res.status(500).json({
            //     success: false,
            //     error: s3Err,
            // });
        } else {
            result.success = true
            result.message = "Berhasil Upload"
            result.data = data.Location
            res.json(result)
            // res.json({
            //     success: true,
            //     data: data.Location,
            // });
        }
    });
}

module.exports = handler