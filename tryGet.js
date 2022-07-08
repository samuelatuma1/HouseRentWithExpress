const mongoose = require("mongoose")
const mongoDB = mongoose.connect("mongodb://127.0.0.1:27017/tryGet", () => console.log("Database Connected"))

const MyUserSchema = mongoose.Schema({
    houseAddress: {
        streetAddress: {
            type: String,
            required: true
                },
        // city, state and country
        cityId: {
            type: mongoose.ObjectId,
            ref: "City"
        }
    }
})

const MyAddress = mongoose.model('MyHouseAddress', MyUserSchema)

const CitySchema = mongoose.Schema({
    city: {
        type: String,
        required: true,
        minlength: 1
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true,
        default: "Nigeria"
    }
})

const City = mongoose.model("City", CitySchema)

async function user1(){
    const newCity = await City.create({
        city: "Lagos",
        state: "Lagos",
        country: "Nigeria"
    })
    const saveCity = await newCity.save()
    const cityId = saveCity._id

    const newAddress = await new MyAddress({houseAddress: {streetAddress: "My House Address", cityId: cityId}})
    const saveAddress = await newAddress.save()
    console.log(saveAddress)
}
user1()