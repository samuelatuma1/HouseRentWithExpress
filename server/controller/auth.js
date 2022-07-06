const {check, validationResult} = require("express-validator")
const User = require('../models/usermodel.js')
const jwt = require("jsonwebtoken")
require("dotenv").config()
const crypto = require("crypto")
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
 * @desc returns sha256 encrypted data in hex 
 */
function hashData(data){
    return crypto.createHmac("sha256", process.env.SECRET)
            .update(data).digest('hex')
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
                password: hashData(req.body.password)
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


async function SignInController (req, res){
    //  Get email and Password (No need to filter)
    const {email, password} = req.body

    // Find first user matching email address
    const user = await User.findByMail(email)

    // If user
    if(user){
        // Hash password, compare with password stored in DataBase
        const hashedInputPassword = hashData(password)

        // Compare with password for user
        if(hashedInputPassword === user.password){
            // Sign token for user
            const token = signToken(user._id)

            // Send the email, fullName and token back
            
            return res.json({email, fullName: user.fullName, token})
        }
    }
    // If user does not exist or password does not match, create a nullObject
    return res.status(404).json({email: null, fullName: null, token: null})
    
}


module.exports = {SignUpController, SignInController}