const mongoose = require("mongoose")

const HouseSchema = new mongoose.Schema({
    // Add user 
    //*************************************************
    // Bare Essentials to Create a house Upload
    uploadedBy: {
        type: mongoose.ObjectId,
        ref: "User",
        required: true
    },
    // houseAddress: 
    streetAddress: {
        type: String,
        required: true
    },
    // city, state and country
    city: {
        type: mongoose.ObjectId,
        ref: "City"
    },
    // End of House Address
    
    bedrooms: {
        type: Number,
    },
    bathrooms: {
        type: Number
    },
    /**
     * @desc Property Description
     */
    description: {
        type: String
    },
    
    // *************************************************
    size: {
        type: Number
    },
    // Rent Details
    amount: {
        type: Number,
        min: 0
    },
    rentPaid: {
        type: String,
        enum: ["weekly", "monthly", "per annum"],  
        default: "per annum"
    },
    
    // leaseDuration
    duration: {
        type: Number,
        max: 10,
        default: 1
    },
    period: {
        type: String,
        enum: ["week", "month", "year"],
        default: "year"
    },
    // End of Lease Duration
    
    leaseDescription: {
        type: String
    },
    // Images media url
    photos: {
        type: [mongoose.ObjectId],
        ref: 'HouseImg',
        default: []
    },
    // listedBy
    listedBy: {
        type: String,
        enum: ["owner", "management company", "tenant"]
    },
    name: {
        type: String
    },
    phone: {
        type: String,
        validate: {
            validator: (val) => {
                // If includes +, must be at the beginning alone
                const accept = "0123456789 +()"
                for(let char of val){
                    if(!accept.includes(char)){
                        return false
                    }
                }
                return true
            },

        message: "Please, include a valid phone Number"
        }
    },
    // End of Listed By
    availabilityForInspection: {
        dayAndTime: [{
            day: {
                type: String,
                enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "saturday", "sunday"]
            }, 
            time: {
                type: String,
                enum: ["morning", "afternoon", "evening"]
            }
        }]
    },

    availabileForRent: {
        type: Boolean,
        default: true
    }

}, {
    //  Strict allows only values in the schema to be saved
    strict: true,
    timestamps: true
})


const HouseImgSchema = new mongoose.Schema({
    imgUrl : {
        type: String,
        required: true
    },
    houseId: {
        type: mongoose.ObjectId,
        required: true,
        ref: "House"
    },
    description: {
        type: String,
        default: ""
    }
}, {
    strict: true,
    timestamps: true
})

const CitySchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
        minlength: 1
    },
    state: {
        type: String,
        required: true,
        minlength: 1
    },
    country: {
        type: String,
        minlength: 1,
        default: "Nigeria"
    }
})

/**
 * 
 * @returns sorted City Collection firt by country, then by state and finally city
 */
CitySchema.query.sortResult = function(){
    return this.sort({country: 1, state: 1, city: 1})
}

const City = mongoose.model("City", CitySchema)
const House = mongoose.model("House", HouseSchema)
const HouseImg = mongoose.model("HouseImg", HouseImgSchema)

module.exports = {
    City, House, HouseImg
}