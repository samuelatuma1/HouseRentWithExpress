// Node modules
const fs = require("fs").promises
const {reportErr} = require("../utils/reportError.js")
// Import 
// Models
const {House, City, HouseImg} = require("../models/houseModel.js");

const {validationResult} = require("express-validator");
const { default: mongoose } = require("mongoose");

// Functions for handling House Info


/**
 * @method POST /house/upload
 * @ACCESS PRIVATE requires Login
 * @param { Request <reqParams = {}, 
 *                  resBody = {},
 *                  reqBody = {
 *                      streetAddress: String,
 *                      propertyType: String
 *                   }
 *                  reqQuery = {},
 *                  locals = {}
 * >} req 
 * @param {*} res 
 * @returns 
 */
async function uploadHouse(req, res){
    try{
        // Handle validation errors
    const formErrs = validationResult(req).errors
    if(formErrs.length > 0){
        return res.json({formErrs})
    }
    
    // Store Data in Data
    // Get who it was uploaded By
    const uploadedBy = req.userId

    if (!uploadedBy){
        return res.sendStatus(400)
    }

    // Get important fields for uploading a house
    const {streetAddress, propertyType} = req.body

    // Save house with data provided
    const newHouse = await House.create({
        uploadedBy,
        streetAddress,
        propertyType
    })

    const house = await newHouse.save()

    return res.status(200).json({ house})
    } catch(err){
        reportErr(err, req)
        return res.sendStatus(500)
    }
}

// Updating House 
/**
 * @method PUT /house/upload/:houseId
 * @desc Updates House with id matching :houseId with req.body . Validates field before updating
 * @ACCESS PRIVATE, requires Login
 * @param { Request <reqParams = {}, 
 *                  resBody = {},
 *                  reqBody = {
 *                      ...House Model
 *                   }
 *                  reqQuery = {},
 *                  locals = {}
 * >} req 
 * @param {*} res 
 * @returns 
 */
async function updateUploadedHouse(req, res){
    try{
        // Check form is valid
        const formErrs = validationResult(req).errors
        if(formErrs.length > 0){
            return res.json({formErrs})
        }

        const houseId = req.params.houseId
        const userId = req.userId
        console.log("Request Body =>", req.body)
        // Get house
        const houseObject = await House.findById(houseId)
        // Send a 404 bad request if user isn't uploader of house
        const isUploadedByUser = houseObject.uploadedBy.equals(userId)
        if(!isUploadedByUser){
            return res.status(403).json({"err": "Attempting to update house not uploaded by you"})
        }
        
        // Update necessary fields
        const updatedFields = req.body
        const updatedHouse = await House.updateOne({ "_id": houseId}, updatedFields)
        // Return Updated House To User
        const responseData = {...houseObject.toObject(), ...updatedFields}
        console.log("Response Data =>", responseData)
        return res.status(200).json(responseData)
    } catch(err){
        reportErr(err, req)
        return res.sendStatus(500)
    }
}

/**
 * @method GET /house/upload/:houseId
 * @desc Gets House with id matching :houseId with req.body uploaded by signed in user
 * @ACCESS PRIVATE, requires Login
 * @param {Params = {houseId: mongoose.ObjectId}} req 
 * @returns houseObject  || status code 403 or 404 or 500
 */
async function getHouse(req, res){
    try{
        const houseId = req.params.houseId
        const userId = req.userId
        
        // Get house
        const houseObject = await House.findById(houseId).select(["-_id"])
        if(!houseObject)
            return res.sendStatus(404)
        // Send a 403 bad request if user isn't uploader of house
        const isUploadedByUser = houseObject.uploadedBy.equals(userId)
        if(!isUploadedByUser){
            return res.status(403).json({"err": "Attempting to update house not uploaded by you"})
        }
        return res.status(200).json(houseObject)
    } catch(err){
        console.log(err)
        reportErr(err, req)
        return res.sendStatus(500)
    }
        
}
// Upload Images related to a house
/**
 * @method POST /house/uploadimg/:houseId
 * @desc Adds images to a House.
 * @ACCESS PROTECTED requires Login
 * @payload multipart-formdata {
        *  houseImg : fileField (Accepts up to 8)
        * description?: String
        * }
        *
    *@returns status(201) 
    *@error res.status(403).json({err: "House doesn't exist"}) OR
            res.sendStatus(500)
 */
async function uploadHouseImage(req, res){
    try{
        // Get HouseModel we are uploading to
        const houseId = req.params.houseId
        const imgFor = await House.findById(houseId)
        if(!imgFor){
            return res.status(403).json({err: "House doesn't exist"})
        }

        // Verify that signed in user is the uploader of the house
        const isUploadedByUser = imgFor.uploadedBy.equals(req.userId)
        if(!isUploadedByUser){
            return res.status(403).json({"err": "Attempting to update house not uploaded by you"})
        }

        // Get uploaded images URl
        const imgFiles = req.files
        console.log(imgFiles)
        for(let imgFile of imgFiles.houseImg){
            const basePath = req.protocol + "://" + req.get("host") + '/'
            const imgPath = basePath + imgFile.destination + imgFile.filename

            // imgUrl may be unncecessary. replaced with imgPath
            const imgUrl = imgFile.path
            console.log("imgFile => ", imgUrl)
            // add imageUrl to HouseImg and House Object
            const newHouseImg = await HouseImg.create({ houseId: imgFor._id, imgUrl, imgPath, description: req.body.description })
            const saveNewHouseImg = await newHouseImg.save()
            // imgFor.photos.push(saveNewHouseImg._id) 

        }

        return res.status(201).json({imgFor: imgFor.toObject()})
    } catch(err){
        console.log(err)
        return res.sendStatus(500)
    }
}



/**
 * @method DELETE /house/houseimgs/:imgId
 * @desc deletes Image Object with imgId, removes imgUrl from house, deletes image file
 * @ACCESS Protected , Requires Login
 * @param {
 *      reqParams = {imgId: mongoose.ObjectId},
 *      resBody = {}, reqBody = {}, reqQuery = {}, locals = {}
 * } req 
 * @param {*} res 
 * @returns 
 */
async function deleteSelectedImg(req, res) {
    try{
        const imgId = req.params.imgId
        const img = await HouseImg.findById(imgId)
        if(!img){
            return res.sendStatus(404)
        }
        // Get house it is linked to
        const imgFor = await House.findById(img.houseId)
        // Ensure that house is uploaded by the user
        if (imgFor){
            const isUploadedByUser = imgFor.uploadedBy.equals(req.userId)
            if(!isUploadedByUser){
                return res.status(403).json({err: "Image not uploaded by you"})
            }
            // Remove Image Url from House Object

            //  -> Get index Of Img
            const imgIdx = imgFor.photos.indexOf(img._id)
            // -> Remove at Index 
            if(imgIdx >= 0){
                imgFor.photos.splice(imgIdx, 1)
                await imgFor.save()
            }
        }

        // Get image file Path
        const imgFilePath = img.imgUrl.replaceAll("\\", "/")
        // Delete file and Image Object
        await fs.unlink(`${imgFilePath}`)
        const deletCount = await HouseImg.findByIdAndDelete(imgId)
        console.log("removed file", imgFilePath)
        console.log("File deleted => ", deletCount)
        // Remove image url from house
        return res.sendStatus(204)
        // return res.json({img: img.toObject(), house: imgFor.toObject()})
    } catch(err){
        console.log(err)
        return res.sendStatus(500)
    }
}
/**
 * @method GET /house/houseimgs/:houseId
 * @desc returns images for house with :houseId
 * @param {<req.Params = {houseId: mongoose.ObjectId} res.body={} req.body={}
 *          req.query={}, req.locals={}>} req
 * @returns {Array<HouseImg>} 
 */
async function getHouseImg(req, res){
    try{
        const houseId = req.params.houseId
        console.log(houseId)
        const house = await House.findById(houseId)

        if(house){
            // find Images having houseId
            const houseImgs = await HouseImg.find({houseId})
            return res.status(200).json(houseImgs)
        }
        return res.sendStatus(404)
    } catch(err){
        console.log(err)
        return res.sendStatus(500)
    }
}

/**
 * @method PUT /house/houseImgs/:imgId
 * @desc Updates description for ImageObject
 * @param {Param= {imgId: mongoose.ObjectId}, 
 *          res.body ={}, req.body={description: String}, req.query={}, req.locals={}} req
 * @returns statusCode(204), 403, 404, 500
 */
async function updateSelectedImg(req, res) {
    try{
        const imgId = req.params.imgId
        const description = req.body.description

        const signedInUser = req.userId
        
        const img = await HouseImg.findById(imgId)
        if(!img){
            res.sendStatus(404)
        }

        // Get House for which Image is uploaded for
        const imgHouse = await House.findById(img.houseId)
        
        // Compare imgHouseId and verify user is uploader
        if(!imgHouse){
            return res.sendStatus(404)
        }
        const uploadedByUser = imgHouse.uploadedBy.equals(req.userId)
        if(!uploadedByUser){
            return res.sendStatus(403)
        }
        img.description = description
        await img.save()
        return res.sendStatus(204)        
    }catch(err){
        console.log(err)
        return res.sendStatus(500)
    }
}

module.exports = {
    uploadHouse, getHouse, updateUploadedHouse, uploadHouseImage, getHouseImg, deleteSelectedImg, updateSelectedImg
}
