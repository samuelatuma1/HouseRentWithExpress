const jwt = require("jsonwebtoken")
const User = require('../models/usermodel.js')

/**
 * @desc Attempts to decrypt JWT Token in Bearer. Adds userId to request object. i.e req.userId = foundUser Id with Token
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {*} next 
 * @returns 
 */
const validateToken = (req, res, next) =>  {
    // Check if token in header or cookies
    const header = req.headers.authorization 
    console.log("cookies", req.cookies)
    console.log("token middle =>", req.cookies.token)
    if(!req.cookies.token && (!header || !header.includes("Bearer"))){
        return res.status(401).json({error: 'Invalid token: Token does not exist'})
    }
    
    //get token from cookies or header
    const token = req.cookies.token || header.split(' ')[1]

    // Add  token to cookie so if token comes in request header, it can be accessed
    // ... via cookie in subsequent requests
    res.cookie("token", token)

    console.log("Token => ", token)
    
    // Verify token
    jwt.verify(token, process.env.JWT_TOKEN, (err, decryptedData) => {
        if (err) 
            return res.status(403).json({ error: "Invalid token: Validation failed"});

        // If valid token, get token, find User
        const ID = decryptedData['id']

        // Extend request.user to include User ID
        req.userId = ID
        next()
    })

}

module.exports = {validateToken}