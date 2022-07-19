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

// Import cookieParser for storing jwt in cookies
const cookieParser = require("cookie-parser")
// Used for accessing cookies
app.use(cookieParser())

// Routes
// Auth Route
const authRoute = require("./urls/auth.js")
app.use("/auth", authRoute)

// house Route
const houseRoute = require("./urls/house.js")
app.use("/house", houseRoute)


// Admin Route
const adminRoute = require("./urls/admin.js")
app.use("/admin", adminRoute)


// Test out Multer
// Import path
const path = require("path")
// Set up


// Serve static files from /media
app.use("/media", express.static("media"))
app.get("*", (req, res) => res.json({msg: `invalid path ${req.url}`}))
//  Listening on PORT
const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`App running on PORT ${PORT}`))







