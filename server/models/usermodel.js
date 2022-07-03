const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    fullName : {
        type: String,
        required: true,
        minlength: 1
    },
    email : {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        validate: {
            validator: (val) => {
                if(!val.includes("@"))
                    return false;
                return true
            },
            message: "Please, include a valid email"
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    password: {
        type: String,
        minlength: 4,
        required: true
    },
    location: {
        type: String,
        default: 'Nigeria'
    }
}, {
    timestamps: true
})

/**
 * Static method for User Model
 * @param {String} email 
 * @returns user with email matching specified or null
 */
UserSchema.statics.findByMail = function (email){
    return this.findOne({email : email})
}
/**
 * Sets a user isActive Property to false
 */
UserSchema.methods.deActivate = function (){
    this.isActive = false
    this.save()
}

/**
 * 
 */
UserSchema.methods.getFirstName = function(){
    return this.fullName.split(' ')[0]
}

let User = mongoose.model('User', UserSchema)
module.exports = User
