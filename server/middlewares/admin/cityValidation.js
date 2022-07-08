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

module.exports = {cityValidation}