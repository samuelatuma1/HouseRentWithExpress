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
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', "POST", "PUT", "DELETE"],
    credentials: true
}
app.use(cors(corsOptions))
app.options("*", cors(corsOptions))
// Handle Post data
app.use(express.json())
app.use(express.urlencoded({extended: true}))


// Routes
const auth = require("./urls/auth.js")

app.use("/auth", auth)

//  Listening on PORT
const PORT = process.env.PORT || 8080



app.listen(PORT, () => console.log(`App running on PORT ${PORT}`))







