const express = require('express');
const uploadImg = require("../middlewares/houseFileUploadHandler.js")
const houseRoute = express.Router()

// Middlewares
const {validateToken} = require("../middlewares/tokenMiddleWare")


// Import Controllers
const {uploadHouse, updateUploadedHouse, uploadHouseImage, getHouseImg, deleteSelectedImg, getHouse, updateSelectedImg} = require("../controller/house")

// Import Validation middleware
const {houseUploadValidation,  houseUpdateValidation} = require("../middlewares/houseUploadValidation")
//  House Upload file fields
const houseUploadFilesForm = uploadImg.fields([
    {name: "houseImg", maxCount: 10}
])


houseRoute.route("/upload")
            .post(validateToken, houseUploadFilesForm, houseUploadValidation, uploadHouse)

houseRoute.route("/upload/:houseId")
    .get(validateToken, getHouse)
    .put(validateToken, houseUploadFilesForm,  houseUpdateValidation, updateUploadedHouse)


houseRoute.route("/uploadimg/:houseId")
    .post(validateToken, houseUploadFilesForm, uploadHouseImage)

houseRoute.route("/houseimgs/:houseId")
    .get(getHouseImg)
    
houseRoute.route("/houseimgs/:imgId")
    .put(validateToken, houseUploadFilesForm, houseUploadValidation, updateSelectedImg)
    .delete(validateToken, deleteSelectedImg)

    
module.exports = houseRoute