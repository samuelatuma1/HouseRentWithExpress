const express = require('express');
const uploadImg = require("../middlewares/houseFileUploadHandler.js")
const houseRoute = express.Router()

// Middlewares
const {validateToken} = require("../middlewares/tokenMiddleWare")


// Import Controllers
const {uploadHouse, updateUploadedHouse, uploadHouseImage, getHouseImg, deleteSelectedImg} = require("../controller/house")

// Import Validation middleware
const {houseUploadValidation} = require("../middlewares/houseUploadValidation")
//  House Upload file fields
const houseUploadFilesForm = uploadImg.fields([
    {name: "houseImg", maxCount: 10}
])


houseRoute.route("/upload")
            .post(validateToken, houseUploadFilesForm, houseUploadValidation, uploadHouse)

houseRoute.route("/upload/:houseId")
    .put(validateToken, houseUploadFilesForm, houseUploadValidation, updateUploadedHouse)


houseRoute.route("/uploadimg/:houseId")
    .post(validateToken, houseUploadFilesForm, uploadHouseImage)

// houseRoute.route("/houseImgs/:houseId")
//     .get(getHouseImg)
houseRoute.route("/houseImgs/:imgId")
    .delete(validateToken, houseUploadFilesForm, houseUploadValidation, deleteSelectedImg)

    
module.exports = houseRoute