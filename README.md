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
        {dbErr: object[
             {
                
             }
        ]}
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


