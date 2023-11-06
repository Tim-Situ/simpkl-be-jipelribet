const express = require("express")
var cookieParser = require("cookie-parser")
var cors = require('cors')
var dotenv = require('dotenv')
dotenv.config()
const app = express()
app.use(cookieParser())
app.use(cors())
app.use(express.json())

app.get('/tes', function (req, res) {
    res.send('Hello World!')
})


app.listen(process.env.APP_PORT, () => {
    console.log("Server up and running...")
}) 

