// Node modules
const fs = require("fs").promises
// Import 
// Models
const {House, City, HouseImg} = require("../models/houseModel.js");

const {validationResult} = require("express-validator")

// Functions for handling House Info


/**
 * @method POST /house/upload
 * @ACCESS PRIVATE requires Login
 * @param { Request <reqParams = {}, 
 *                  resBody = {},
 *                  reqBody = {
 *                      streetAddress: String,
 *                      city: mongoose.ObjectId
 *                             
 *                      size?: String,
 *                      bedrooms: Number,
 *                      bathrooms: Number,
 *                      description: String,
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
    const {streetAddress, city, bedrooms, 
            bathrooms, description
        } = req.body

    // Save house with data provided
    const newHouse = await House.create({
        uploadedBy,
        streetAddress,
        city,
        bedrooms,
        bathrooms,
        description
    })

    const house = await newHouse.save()

    return res.status(200).json({ house})
    } catch(err){
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
        return res.status(200).json(responseData)
    } catch(err){
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
            const imgUrl = imgFile.path
            // add imageUrl to HouseImg and House Object
            const newHouseImg = await HouseImg.create({ houseId: imgFor._id, imgUrl })
            const saveNewHouseImg = await newHouseImg.save()
            imgFor.photos.push(saveNewHouseImg._id) 
            await imgFor.save()
        }

        return res.status(201).json({imgFor: imgFor.toObject()})
    } catch(err){
        console.log(err)
        return res.sendStatus(500)
    }
}

/**
 * @method DELETE /house/houseImgs/:imgId
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
            res.sendStatus(404)
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
        return res.status(500).json({err: "An error occured"})
    }
}
async function getHouseImg(req, res){
    try{
        const houseId = req.params.houseId
        const house = await House.findById(houseId)

        const imgObjectIds = house.photos
        const imgUrls = []
        let myPage = "<div>"
        for (let imgObj of imgObjectIds){
            const imgObject = await HouseImg.findById(imgObj)
            const imgUrl = imgObject.imgUrl.replaceAll("\\", "/")
            imgUrls.push(imgUrl)
            myPage += `<img src="/${imgUrl}" />`
        }

        myPage += "</div>"
        res.set("Content-Type", "text/html")
        return res.send(myPage)
        return res.redirect(307, `/${imgUrls[0]}`)
        return res.json({imgUrls} )

    } catch(err){
        console.log(err)
        return res.sendStatus(500)
    }
}
module.exports = {
    uploadHouse, updateUploadedHouse, uploadHouseImage, getHouseImg, deleteSelectedImg
}
