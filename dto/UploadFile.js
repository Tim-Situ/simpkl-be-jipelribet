const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    endpoint: process.env.ENDPOINT,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
});

async function uploadImageToS3(file, username) {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: `tplum/jurnalHarian/${username}`, // Atur struktur folder sesuai kebutuhan
            Key: `${Math.floor(Date.now() / 1000)}.png`,
            Body: file.buffer,
            ACL: 'public-read',
            ContentEncoding: 'base64',
            ContentType: 'image/png',
        };

        s3.upload(params, (s3Err, data) => {
            if (s3Err) {
                reject(s3Err);
            } else {
                resolve(data.Location);
            }
        });
    });
}

module.exports = { uploadImageToS3 };
