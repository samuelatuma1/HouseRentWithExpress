const {City} = require("../models/houseModel.js")
const {validationResult} = require("express-validator")
/**
 * @desc adds new city in City Collection.
 * @method POST
 * @access PRIVATE
 * @payLoad {
    *  city: String, state: String, country?: String
 * }
 * 
 * @returns savedCity if all goes well => example {
        "city": "PH", "state": "Rivers", "country": "Nigeria", "_id": "62c",
        "__v": 0 }
* OR    {
  "msg": "city already exists",
  "city": "PH", "state": "Rivers", "_id": "62c"
} if city already exists in City Collection
OR {
  "formErrs": [
    {"value": "", "msg": "Invalid value", "param": "state","location": "body"}
]
} if Form errs 
 */
async function addCityController(req, res){
    try{
        // Validate city data
        const formErrs = validationResult(req).errors
        if(formErrs.length > 0){
            return res.json({formErrs})
        }

        const { city, state} = req.body
        // Use Nigeria as default country
        let country = "Nigeria"
        if (req.body.hasOwnProperty("country")){
            // Update country if country added in form
            country = req.body.country
        }
        // Check if city exists
        const cityExists = await City.findOne({city : new RegExp(city, "i")
            , state: new RegExp(state, "i"), country: new RegExp(country, 'i')})
        if(cityExists){
            const {city, state, _id} = cityExists
            return res.json({
                msg: "city already exists",
                city, state, country, _id
            })
        }
        // Create new city
        console.log({country})
        const newCity = await City.create({city, state, country})
        const saveCity = await newCity.save()
        console.log(saveCity)
        return res.json(saveCity)
    }
    catch(err){
        return res.json({err: err})
    }
}

module.exports = {addCityController}