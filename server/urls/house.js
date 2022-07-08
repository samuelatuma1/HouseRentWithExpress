const express = require('express');
const uploadImg = require("../middlewares/houseFileUploadHandler.js")
const houseRoute = express.Router()


// Import Controllers
const {uploadHouse} = require("../controller/house")

// Import Validation middleware
const {houseUploadValidation} = require("../middlewares/houseUploadValidation")
//  House Upload file fields
const houseUploadFilesForm = uploadImg.fields([
    {name: "houseImg", maxCount: 10}
])
houseRoute.route("/upload")
            .post(houseUploadFilesForm, houseUploadValidation, uploadHouse)
    
module.exports = houseRoute