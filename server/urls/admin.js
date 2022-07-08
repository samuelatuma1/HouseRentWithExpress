const adminRoute = require("express").Router()
const {cityValidation, updateCityValidation  } = require("../middlewares/admin/cityValidation")

// Import middlewares
const {verifyIsAdmin} = require("../middlewares/admin/adminAuthMiddleWare")
const {validateToken} = require("../middlewares/tokenMiddleWare")

// Import Controllers
const {addCityController, getCitiesController, updateCityController} = require("../controller/admin")

adminRoute.route("/city")
    .get(validateToken, verifyIsAdmin, getCitiesController)
    .post(validateToken, verifyIsAdmin,cityValidation, addCityController)

adminRoute.patch("/city/:id", validateToken, verifyIsAdmin,updateCityValidation , updateCityController)

module.exports = adminRoute