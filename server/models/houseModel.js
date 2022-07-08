const mongoose = require("mongoose")

const HouseSchema = new mongoose.Schema({
    houseAddress: {
        streetAddress: {
            type: String,
            required: true
                },
        // city, state and country
        // 
        city: {
            type: mongoose.ObjectId,
            ref: "City"
        }
    },
    size: {
        type: Number
    },
    bedrooms: {
        type: Number,
    },
    bathrooms: {
        type: Number
    },
    description: {
        type: String
    },
    rent: {
        amount: {
            type: Number,
            min: 0
        },
        rentPaid: {
            enum: ["weekly", "monthly", "per anum"],  
        },
    },
    leaseDuration: {
        duration: {
            type: Number,
            max: 10,
            default: 1
        },
        period: {
            type: String,
            enum: ["week", "month", "year"],
            default: "year"
        }
    },
    leaseDescription: {
        type: String
    },
    // Images media url
    photos: {
        type: [mongoose.ObjectId],
        ref: 'HouseImg'
    },
    listedBy: {
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
        }
    },
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
    }
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

const City = mongoose.model("City", CitySchema)
const House = mongoose.model("House", HouseSchema)
const HouseImg = mongoose.model("HouseImg", HouseImgSchema)

module.exports = {
    City, House, HouseImg
}