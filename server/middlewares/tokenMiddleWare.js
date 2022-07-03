const jwt = require("jsonwebtoken")
const User = require('../models/usermodel.js')

/**
 * @desc Attempts to decrypt JWT Token in Bearer. Adds user to request object. i.e req.user = foundUser with Token
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {*} next 
 * @returns 
 */
const validateToken = (req, res, next) =>  {
    // Check if token in header
    const header = req.headers.authorization
    if(!header || !header.includes("Bearer")){
        return res.status(401).json({error: 'Invalid token: Token does not exist'})
    }

    //get token
    const token = header.split(' ')[1]

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