// Import 
const {validationResult} = require("express-validator")
// Functions for handling House Info

function uploadHouse(req, res){
    // Handle validation errors
    const formErrs = validationResult(req).errors
    if(formErrs.length > 0){
        return res.json({formErrs})
    }
    // Get formData, including image url, 
    const files = req.files
    const formData = req.body
    return res.json({files, formData})
}

module.exports = {
    uploadHouse
}
