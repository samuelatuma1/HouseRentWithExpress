const mongoose = require("mongoose")
require("dotenv").config()
const connectDB = require("./config.js")
const cors = require("cors")

//  Connect to DataBase
connectDB()


// Get express
const express = require("express")
const app = express()

// Use cors to allow react
app.use(cors({
    origin: 'http://localhost:3000'
}))
// Handle Post data
app.use(express.json())
app.use(express.urlencoded({extended: true}))


// Routes
const auth = require("./urls/auth.js")

app.use("/auth", auth)

//  Listening on PORT
const PORT = process.env.PORT || 8080



app.listen(PORT, () => console.log(`App running on PORT ${PORT}`))







