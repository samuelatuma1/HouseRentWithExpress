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

/**
 * @returns all Cadded cities sorted first by country, then by state, lastly by city
 */
async function getCitiesController(req, res){
    // Sort countries by country, then by state, lastly by city
    const allCities = await City.where({}).sortResult()
    return res.json(allCities)
}

async function updateCityController(req, res){
    // Handle form validation
    const formErrs = validationResult(req).errors
    if(formErrs.length > 0){
        return res.status(400).json({formErrs})
    }
    // Find city
    const id = req.params.id

    // Update property
    const updateCity = await City.findByIdAndUpdate(id, req.body)
    if(!updateCity)
        return res.sendStatus(404);
    return res.sendStatus(204)
}
module.exports = {addCityController, getCitiesController, updateCityController}