const {check, body} = require("express-validator")

const cityValidation = [
    check("city")
        .trim().notEmpty(),

    check("state")
        .trim().notEmpty(),
        
    check("country")
        .if(body("country").exists())
            .trim().notEmpty()
            .withMessage("Please add a valid country.")
]

/**
 * @desc Verifies that if city, state or country is included, data is valid
 */
const updateCityValidation = [
    check("city")
        .if(body("city").exists())
        .trim().notEmpty()
        .withMessage("Please add a valid city."),

    check("state")
        .if(body("state").exists())
            .trim().notEmpty()
            .withMessage("Please, add a valid state"),

    check("country")
        .if(body("country").exists())
            .trim().notEmpty()
            .withMessage("Please add a valid country.")
]

module.exports = {cityValidation, updateCityValidation }