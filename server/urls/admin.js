const adminRoute = require("express").Router()
const {cityValidation, updateCityValidation  } = require("../middlewares/admin/cityValidation")

// Import middlewares
const {verifyIsAdmin} = require("../middlewares/admin/adminAuthMiddleWare")
const {validateToken} = require("../middlewares/tokenMiddleWare")

// Import Controllers
const {addCityController, getCitiesController, updateCityController, deleteCityController, searchCity, getCity, validateIsAdmin} = require("../controller/admin")

adminRoute.route("/isAdmin")
    .get(validateToken, verifyIsAdmin, validateIsAdmin)

adminRoute.route("/city")
    .get(validateToken, verifyIsAdmin, getCitiesController)
    .post(validateToken, verifyIsAdmin,cityValidation, addCityController)

adminRoute.route("/city/:id")
    .get(validateToken, verifyIsAdmin, getCity)
    .patch(validateToken, verifyIsAdmin, updateCityValidation , updateCityController)
    .delete(validateToken, verifyIsAdmin, deleteCityController)

adminRoute.route("/search").get(validateToken, verifyIsAdmin, searchCity)



module.exports = adminRoute