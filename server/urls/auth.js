const express = require("express")
const auth= express.Router()
const {SignUpController, SignInController, isAuthenticated} = require("../controller/auth.js")
const User = require('../models/usermodel.js')

// Middle wares
const {UserSignUpValidation} = require("../middlewares/userValidation.js")
const {validateToken} = require("../middlewares/tokenMiddleWare")
auth.route("/signup").post(UserSignUpValidation, SignUpController)

auth.route("/signin").post(SignInController)

auth.get("/isAuthenticated", isAuthenticated )


auth.get("/data", validateToken,async function(req, res){
    const user = await User.findById(req.userId)
    console.log(user)
    return res.send(req.userId)
})
module.exports = auth