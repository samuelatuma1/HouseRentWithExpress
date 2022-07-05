const {check, validationResult} = require("express-validator")
const User = require('../models/usermodel.js')
const jwt = require("jsonwebtoken")

/**
 * @desc signs a token. Takes id signs it as json token -> {id: value}
 * @param {String} id
 * @returns tokenized -> {id: id}
 */
const signToken = id => {
    const signID = jwt.sign({id}, process.env.JWT_TOKEN, { expiresIn: '30d'})
    return signID
}

/**
 * @desc Signs up a User 
 * @route POST /auth/signup
 * @access PUBLIC
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns the signed up user || error
 */
const SignUpController = async (req, res) => {
    // Validate form
    console.log(req.body, req.hostname, req.originalUrl)
    let formErrs = validationResult(req).errors
    if (formErrs.length > 0){
        return res.json({formErrs})
        
    }
    // If form is valid, do...
    try{
        const newUser = await User.create(
            {
                fullName : req.body.fullName,
                email: req.body.email,
                password: req.body.password
            }
        )
        // Add User to Collection
        let saveUser = await newUser.save()
        console.log(saveUser)
        
        // Tokenize ID

        let usertoken = signToken(saveUser._id)
        saveUser.token = usertoken
        let { email, fullName, token } = saveUser 
        return res.status(201).json({ email, fullName, token })



    } 
    catch(err){
        return res.status(200).json({dbErr: err})
    }
}


function SignInController (req, res){
    //  Get email and Password
    
}


module.exports = {SignUpController}