const BaseResponse = require("../../dto/BaseResponse")
var Joi = require("joi")

var pengumumanService = require("../../services/Pengumuman")

const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKey.json");

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        pengumuman : Joi.string().required()
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { pengumuman } = value

    var status = true;

    var pengumumanBaru = await pengumumanService.createNew({
        pengumuman,
        status,
        createdBy: req.username
    })

    if (pengumumanBaru.success) {
        const topic = "all-devices";

        const message = {
            notification: {
                title: "Pengumuman!",
                body: pengumuman,
            },
            topic,
        };

        try {
            await admin.messaging().send(message);
        } catch (error) {
            res.status(500).send({ message: "Failed to send notification.", error });
        }

        result.message = "Pengumuman berhasil ditambahkan..."
        result.data = pengumumanBaru.data
        res.json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler