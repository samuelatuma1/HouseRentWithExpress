const multer = require("multer")
const path = require("path")

// Configure file destination and filename
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        // Set destination for files, starting at base folder
        const dest = 'media/'
        return callBack(null, dest)
    },
    filename: (req, file, callBack) => {
        // Set name for file when stored in destination
        // Get mimetype (To extract file extension from it)
            // Example mimetype => "image/png"
        const mimetype = file.mimetype.split("/")[1]
        const fileName = `houseUpload-${Date.now()}-${Math.floor(Math.random() * 10000000000)}-${mimetype}`
        return callBack(null, fileName)
    }
})

/**
 * @desc limits fileSize to 20MB
 */
const limits = {
    fileSize: 20000000
}

/**
 * @desc Filters file submitted to accept only extensions [".jpg", ".jpeg", ".png", ".gif"]
 */
const fileFilter = (req, file, callBack) => {
    const acceptedTypes = [".jpg", ".jpeg", ".png", ".gif"]
    const fileType = path.extname(file.originalname)
    const acceptFile = acceptedTypes.includes(fileType.toLowerCase())
    if(acceptFile) {
        return callBack(null, true)
    }
    return callBack(new Error("Invalid file type: " + fileType))
}
/**
 * @desc Stores images in 'media/', rename files to avoid name conflict,
 *  ensures file is of type image
 * @fileSizeLimit :-> File size is limited to 20MB
 */
const uploadImg = multer({storage, limits, fileFilter})


module.exports = uploadImg