const {check, body} = require("express-validator");

const houseUploadValidation = [
    check("streetAddress").trim().isLength({min: 1})
        .withMessage("Please include a valid street address"),
    check("propertyType").trim().isLength({min: 1}).custom((val, {req}) => {
        const accepted = ["house", "condo", "townhouse", "entire apartment"]
        const lowerCasedVal = val.toLowerCase()
        if(!accepted.includes(lowerCasedVal))
            throw new Error("Invalid property Type");
        return val;
    }),
]

const houseUpdateValidation = [
    check("bedrooms").if(body("bedrooms").exists()).isNumeric(),
    check("bathrooms").if(body("bathrooms").exists()).isNumeric(),
    check("description").if(body("description").exists()).trim().isLength({min: 0}),
    check("amount").if(body("amount").exists()).isNumeric(),
    check("rentPaid").if(body("rentPaid").exists()).isLength({min: 3}),
    check("listedBy").if(body("listedBy").exists()).custom((val, {req}) => {
        const accepted = ["owner", "management company", "tenant"]
        if(accepted.includes(val.toLowerCase()))
            return val;
        throw new Error(`value must be one of ['owner', 'management company', 'tenant']`)
    }),
    check("name").if(body("name").exists()).trim().isLength({min: 1}).trim().not().isEmpty()
       .withMessage("Please, include a valid name"),
    check("phone").if(body("phone").exists())
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
    check("availabilityForInspection").if(body("availabilityForInspection").exists())
        .isArray()
]

module.exports = {
    houseUploadValidation, houseUpdateValidation
}