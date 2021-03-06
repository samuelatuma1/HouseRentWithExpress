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
                // isAdmin: true, 
                password: hashData(req.body.password)
            }
        )
        // Add User to Collection
        let saveUser = await newUser.save()
        console.log(saveUser)
        
        // Tokenize ID
        let usertoken = signToken(saveUser._id)
        saveUser.token = usertoken
        // Set token in cookie
        res.cookie("token", usertoken)
        let { email, fullName, token, isAdmin } = saveUser 
        return res.status(201).json({ email, fullName, token, isAdmin  })



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

            // Set token in cookie
            res.cookie("token", token)


            // Send the email, fullName and token back
            
            return res.json({email, fullName: user.fullName, token, isAdmin: user.isAdmin})
        }
    }
    // If user does not exist or password does not match, create a nullObject
    return res.status(404).json({email: null, fullName: null, token: null})
    
}


/**
 * @desc checks if user is signed in.
 * @returns 200 {"isAuthenticated": Boolean} depending on if user is signed in or not
 */
async function isAuthenticated(req, res){
   try{
     // Check cookie for token
     const token = req.cookies.token
     console.log({token: token})
     let isAuthenticated = false
     if(!token){
         return res.json({isAuthenticated})
     }
 
     // Decrypt token
     jwt.verify(token, process.env.JWT_TOKEN, async (err, decryptedData) => {
         const {userId} = decryptedData
         const user = await User.findById(userId)
         if(user)
            return res.json({isAuthenticated: true});
        
        return res.json({isAuthenticated: true});

     })
   } catch(err){
    return res.json({isAuthenticated : false})
   }
}


module.exports = {SignUpController, SignInController, isAuthenticated}