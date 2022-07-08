const User = require('../../models/usermodel.js')

/**
 * @desc Middleware to give only admins access to admin protected routes.
 *  must be used after jwt Authentication middleware
 * @returns next() if user is admin, else status code of 403
 */
async function verifyIsAdmin(req, res, next){
    try{
        const userId = (req.userId)
        // Get user
        const user = await User.findById(userId)
        // If user
        if(user){
            // check if user is admin
            if(user.isAdmin){
                return next()
            }
        }
        return res.sendStatus(403)
    } catch(err){
        return res.sendStatus(403)
    }

}

module.exports = {verifyIsAdmin}