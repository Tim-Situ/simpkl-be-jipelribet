const express = require("express")
var cookieParser = require("cookie-parser")
var cors = require('cors')
var dotenv = require('dotenv')

dotenv.config()

const app = express()
app.use(cookieParser())
app.use(cors())
app.use(express.json())

// Route
app.use("/auth", require("./routes/Auth"))


app.listen(process.env.APP_PORT, () => {
    console.log("Server up and running...")
}) 

