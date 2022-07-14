const {City} = require("../models/houseModel.js")
const {validationResult} = require("express-validator")
/**
 * @desc adds new city in City Collection.
 * @method POST /city
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
        return res.status(201).json(saveCity)
    }
    catch(err){
        return res.json({err: err})
    }
}

/**
 * @method GET /city/
 * @returns all added cities sorted first by country, then by state, lastly by city
 */
async function getCitiesController(req, res){
    // Sort countries by country, then by state, lastly by city
    const allCities = await City.where({}).sortResult()
    return res.json(allCities)
}

/**
 * @method PATCH /city/:id
 * @access PROTECTED, admin ACCESS
 * @desc Updates city with id matching params.id. validates fields to be updated first.
 * @returns status 204 if city is exists and is update, else 404
 */
async function updateCityController(req, res){
    // Handle form validation
    const formErrs = validationResult(req).errors
    if(formErrs.length > 0){
        return res.status(400).json({formErrs})
    }
    // Find city
    const id = req.params.id

    // delete __v and _id from form
    const updateProperties = req.body
    delete updateProperties["_id"]
    delete updateProperties["__v"]

    // Update City
    const updateCity = await City.findByIdAndUpdate(id, updateProperties)
    if(!updateCity)
        return res.sendStatus(404);
    return res.sendStatus(204)
}

/**
 * 
 * @method GET /admin/city/:id
 * @returns all city in database matching :id OR 404
 * 
*/
async function getCity(req, res){
    const cityId = await City.findById(req.params.id)
    if(cityId){
        return res.json(cityId)
    }
    return res.sendStatus(404)
}


/**
 * @method DELETE /city/:id
 * @access PROTECTED, admin ACCESS
 * @desc Deletes city with id matching params.id.
 * @returns status code => 204 
*/
async function deleteCityController(req, res){
    // Find city
    const id = req.params.id
    await City.findByIdAndDelete(id)
    return res.sendStatus(204)
}

/**
 * @route /search?by=${String}&search=${String}/
 * @desc searches the City model 
 * @method GET
 * @access PRIVATE
 * @query {
 *      by: {   
 *              type: String
 *             enum: [all, city, country, state],
 *               }
 *      search: String   
 * }  
 
 * @returns [{
    "_id": ObjectId,
    "city": String,
    "state": String,
    "country": String,
    "__v": 0
  }]
 */
async function searchCity(req, res){
    const search = req.query.search 
    const by = req.query.by

    // Make sure by is an enum in ["all", "city", "country", "state"]

    const accepted = ["all", "city", "country", "state"]
    if (!accepted.includes(by.toLowerCase())){
        return res.json([])
    }
    let results = []
    // Search based on by param if anything but all
    if(by !== "all"){
        results = await City.where({[by]: new RegExp(search, "i")})
    }
    else{
        // Search all fields if all
        results = await City.where({"$or": [
            {city:  new RegExp(search, "i")},
            {state:  new RegExp(search, "i")},
            {country:  new RegExp(search, "i")}
        ]})
    }
    return res.json(results)
}

// 
function validateIsAdmin(req, res){
    return res.sendStatus(200)
}
module.exports = {addCityController, getCitiesController, updateCityController, deleteCityController, searchCity, getCity, validateIsAdmin}