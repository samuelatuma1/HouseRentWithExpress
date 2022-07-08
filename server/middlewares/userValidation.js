const {check} = require("express-validator")

const UserSignUpValidation = [
    check('fullName')
        .isLength({min : 2})
        .custom((value, {req}) => {
            const forbidden = '#?/{}'
            for(let char of value){
                if(forbidden.includes(char)){
                    throw new Error("Please, use a valid name")
                }
            }
            return value
        }).not().isEmpty().trim().withMessage("Invalid Full Name"),
    
    check("email").isEmail(),

    check("password").isLength({min : 4}).not().isEmpty(),
    check("password2").custom((val, {req} ) => {
        if(req.body.password !== val){
            throw new Error("Please, passwords must match")
        }
        return val
    })
]


module.exports = {
    UserSignUpValidation
}