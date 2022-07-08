const adminRoute = require("express").Router()
const {cityValidation } = require("../middlewares/admin/cityValidation")

// Import Controllers
const {addCityController} = require("../controller/admin")

adminRoute.route("/city").post(cityValidation, addCityController)
    
module.exports = adminRoute