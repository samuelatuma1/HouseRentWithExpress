# This is a Project that helps with Searching For Houses
## This Project is built with
    - Node.js, Express.js, React.js, MongoDB, JWT

## DEPENDENCIES
    "chai": "^4.3.6",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "express": "^4.18.1",
    "express-graphql": "^0.12.0",
    "express-session": "^1.17.3",
    "express-validator": "^6.14.2",
    "graphql": "^16.5.0",
    "jsonwebtoken": "^8.5.1",
    "mocha": "^10.0.0",
    "mongoose": "^6.4.0",
    "multer": "^1.4.5-lts.1"


## API Documentation

### EndPoints
#### Auth Endpoints
<ul>

    - @route /auth/signup
    - @method POST
    - @access PUBLIC
    - @headers {...}
    -@payload {
            fullName : string,
            email: string,
            password: string,
            password2: string
        }
    - @desc 
        Stores Payload data in database, hash password
    - @ returns {
        token : JWTToken
    } OR {formErrs: object[{
             "msg": "Invalid value",
             "param": "fullName",
             "location": "body"
           }]} OR 
        {dbErr:{
            "index": number,
            "code": number,
            "keyPattern": {
            "email": 1
            },
            "keyValue": {
            "email": "email"
            }}
</ul>

<ul>

    - @route /auth/signin
    - @method POST
    - @access PUBLIC
    - @headers {...}
    -@payload {
            email: string,
            password: string
        }
    - @desc     Retrieves userdata with matching email and password
    - @ returns {
        email: string, fullName: string, token: JWTToken
    } OR 404
</ul>


#### Admin EndPoints
<ul>
    
    * @method POST /admin/city
    * @desc adds new city in City Collection.
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
</ul>

<ul>
    
    * @method GET /city/
    * @returns all added cities sorted first by country, then by state, lastly by cityId

    ------------------------------------------------------------------------------------------------
    * @method GET /admin/city/:id
    * @returns all city in database matching :id OR 404
</ul>

<ul>

    * @method PATCH /city/:id
    * @access PROTECTED, admin ACCESS
    * @desc Updates city with id matching params.id. validates fields to be updated first.
    * @returns status 204 if city is exists and is update, else 404

    -------------------------------------------------------------------------------
    * @method DELETE /city/:id
    * @access PROTECTED, admin ACCESS
    * @desc Deletes city with id matching params.id.
    * @returns status code => 204 
</ul>

<ul>
    
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
</ul>


#### House Endpoints
<ul>
   
    #### @method POST /house/upload
    * @ACCESS PRIVATE requires Login
    * @param { Request <reqParams = {}, 
    *                  resBody = {},
    *                  reqBody = {
    *                      streetAddress: String,
    *                      propertyType: String
    *                   }
    *                  reqQuery = {},
    *                  locals = {}
    * >} req 
    * @returns HouseObject {
                  _id: mongoose.ObjectId
                  streetAddress: String,
    *             propertyType: String,
    *             uploadedBy: mongoose.ObjectId
    *             ...
    *   }
    * @error 400, 500

    #### @method PUT /house/upload/:houseId
    * @desc Updates House with id matching :houseId with req.body . Validates field before updating
    * @ACCESS PRIVATE, requires Login
    * @param { Request <reqParams = {}, 
    *                  resBody = {},
    *                  reqBody = {
    *                      ...House Model
    *                   }
    *                  reqQuery = {},
    *                  locals = {}
    * >} req 
    *   
    * @returns HouseObject {
    *             _id: mongoose.ObjectId
    *             streetAddress: String,
    *             city: mongoose.ObjectId            
    *             size: String,
    *             bedrooms: Number,
    *             bathrooms: Number,
    *             description: String,
    *             ...
    *   }
    *
    #### @method GET /house/upload/:houseId
    * @desc Gets House with id matching :houseId with req.body uploaded by signed in user
    * @ACCESS PRIVATE, requires Login
    * @param {Params = {houseId: mongoose.ObjectId}} req 
    * @returns {
    *             _id: mongoose.ObjectId
    *             streetAddress: String,
    *             city: mongoose.ObjectId            
    *             size: String,
    *             bedrooms: Number,
    *             bathrooms: Number,
    *             description: String,
    *             ...
    *   } || status code 403 or 404 or 500


    #### @method POST /house/uploadimg/:houseId
    * @desc Adds images to a House.
    * @ACCESS PROTECTED requires Login
    * @payload multipart-formdata {
            *  houseImg : fileField (Accepts up to 8)
            * description?: String
            * }
    * @returns ImageObject {
        _id: mongoose.ObjectId
        imgUrl : path String,
        imgPath: path String,
        houseId: mongoose.ObjectId
        description: String
        createdAt: DateTime
        updatedAt: DateTime
    }


    #### @method GET /house/houseimgs/:houseId
    * @desc returns HouseImg Objects for house with :houseId
    * @param {<req.Params = {houseId: mongoose.ObjectId} res.body={} req.body={}
    *          req.query={}, req.locals={}>} req
    * @returns {Array<{
        _id: mongoose.ObjectId
        imgUrl : path String,
        imgPath: path String,
        houseId: mongoose.ObjectId
        description: String
        createdAt: DateTime
        updatedAt: DateTime
    }>} 
 

    ### @method DELETE /house/houseImgs/:imgId
    * @ACCESS Protected , Requires Login
     * @desc deletes Image Object with imgId, removes imgUrl from house, deletes image file
    * @param Request {
            reqParams = {imgId: mongoose.ObjectId}
        } req 
    * @param {*} res 
    * @returns 204
    @errors 500 {err: "An error occured"}, (403) {err: "Image not uploaded by you"}, 404

    ### @method PUT /house/houseImgs/:imgId
    * @desc Updates description for ImageObject
    * @param {Param= {imgId: mongoose.ObjectId}, 
    *          res.body ={}, req.body={description: String}, req.query={}, req.locals={}} req
    * @returns statusCode(204), 403, 404, 500


    ### @method GET /house/list/:houseId
    * @desc lists house for subscribers to view 
    * @ACCESS PRIVATE, requires Login
    * @param { Request <reqParams = {houseId: mongoose.ObjectId}, 
    *                  resBody = {}
    *                  reqQuery = {},
    *                  locals = {}
    * >} req 
    * @param {*} res 
    * @returns 200 or 403 or 400
</ul>