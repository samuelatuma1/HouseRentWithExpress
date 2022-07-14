# This is a Project that helps with Searching For Houses
## This Project is built with
    - Node.js, Express.js, React.js, MongoDB, JWT

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

