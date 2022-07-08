const {check} = require("express-validator");

const houseUploadValidation = [
    check("streetAddress").isLength({min: 1})
        .withMessage("Please include a valid street address"),
    check("bedrooms").isNumeric(),
    check("bathrooms").isNumeric(),
    check("description").isLength({min: 2}),
    check("amount").isNumeric(),
    check("rentPaid").isLength({min: 3}),
    check("listedBy").custom((val, {req}) => {
        const accepted = ["owner", "management company", "tenant"]
        if(accepted.includes(val.toLowerCase()))
            return val;
        throw new Error('value must be one of ["owner", "management company", "tenant"]')
    }),
    check("name").isLength({min: 1}).trim().not().isEmpty()
       .withMessage("Please, include a valid name"),
    check("phone")
        .isLength({min: 10})
        .custom((val, {req}) => {
        const accept = "0123456789 +()"
                    for(let char of val){
                        if(!accept.includes(char)){
                            throw new Error("Invalid character in phone number")
                        }
                    }
                    return val
    }),
    check("availabilityForInspection")
        .isArray()
]

module.exports = {
    houseUploadValidation
}