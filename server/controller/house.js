
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
    // Return Updated Hoouse To User
    const responseData = {...houseObject.toObject(), ...updatedFields}
    return res.status(200).json(responseData)

}
module.exports = {
    uploadHouse, updateUploadedHouse
}
