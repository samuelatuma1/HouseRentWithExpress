import {useState} from 'react';
import './signup.css'
import NavigationBar from '../../components/navigation'

// Import Global User state to set User
import {SetUser} from "../../store/atoms"

// Import 
import  {useSetRecoilState} from "recoil";

// Route link
import {Link} from "react-router-dom";
// Strong password check
function strongPasswordCheck(password) {
    const response = {
        error: false,
        msg: "Valid password"
    }
    const capitalChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let containsCapitalChars = false
    
    const specialChars = '!.?-_*&^%$£"\'#,<>'
    let containsSpecialChars = false
    for(let char of password){
        if(capitalChars.includes(char)){
            containsCapitalChars = true
        }
        else if(specialChars.includes(char)){
            containsSpecialChars = true
        }
    }

    if(!containsCapitalChars){
        response.msg = "password must contain at least one capital letter"
        response.error = true
    }
        

    if (!containsSpecialChars){
        response.msg =  ("Must contain special Characters")
        response.error = true
    }
    return response
    }
    


function SignUpForm(props){
    
    // Organize All form Data 
    const [formData, setFormData] = useState({
        fullName: "", email: "", 
        password: "", password2: ""
    })

    // Handle form Errors
    const [formErrs, setFormErrs] = useState([])

    // Tool to set global User
    const setUser = useSetRecoilState(SetUser)

    // Handle Form success
    const [formSuccess, setFormSuccess] = useState([])
    // E.g  formError [
        //   {
        //     "msg": "Invalid value",
        //     "param": "fullName",
        //     "location": "body"
        //   }
        // ]

    function updateForm(e){
        let inputName = e.target.name
        setFormData(prevData => ({
            ...prevData, [inputName] : e.target.value
        }))
    }

    async function submitUserForm(e){
        e.preventDefault()
        // Ensure Password1 matches password2
        if(formData.password !== formData.password2){
            setFormErrs([{
                msg: "Passwords must match"
            }])
            // Stop processing if passwords don't match
            return
        }
        // Some more validations can go here
        const strongPassword = strongPasswordCheck(formData.password)
        if(strongPassword.error){
            setFormErrs([{
                msg: strongPassword.msg
            }])
            return
        } else{
            setFormErrs([])
        }


        // Submit form to server
        let formBody = formData
        const signUpReq = await fetch("/auth/signup", {
            method: 'POST',
            mode: 'cors', 
            cache: 'no-cache', 
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow', 
            referrerPolicy: 'no-referrer',  
            body: JSON.stringify(formBody)
        })
        if(signUpReq.ok){
            const signUpRes = await signUpReq.json()
            // Check if there are formErrors
            if(signUpRes.formErrs){
                // Update formErrs state with err Messages 
                setFormErrs(prevErrs => signUpRes.formErrs)
                return;
            } 

            // Check if DataBase Error
            if(signUpRes.dbErr){
                // Update Form Error state with err Message
                setFormErrs(prevErrs => [{ msg: "Email already in use."}])
                return ;
            }

            // Set form errors to []
            setFormErrs(prevErrs => [])

            // Set form Success to success message
            setFormSuccess(prevSuccess => [{msg: "Successfully registered"}])

            // Set up global user state.
            setUser(signUpRes)
    }
}


    return (
        <form onSubmit={submitUserForm} className="Authform">
            <h1>Sign Up to House Rent</h1>
            {
                formErrs ? (
                    formErrs.map((err, id) => (
                        <li className="formErr" key={id}>
                            {err.msg}
                        </li>
                    ))
                ) : <></>
            }
            {
                formSuccess ? (
                    formSuccess.map((data, id) => (
                        <li className="formSuccess" key={id}>
                            {data.msg}
                        </li>
                    ))
                ) : <></>
            }
            <label htmlFor="fullName">
                Full Name: 
                <input type="text" name="fullName" required minLength='3' value={formData.fullName} onChange={updateForm}/>
            </label>

            <label htmlFor="email">
                Email: 
                <input type="email" name="email" required value={formData.email}  onChange={updateForm}/>
            </label>

            {/* <label htmlFor="location">
                location: 
                <input type="text" name="location" required minLength='3'/>
            </label> */}

            <label htmlFor="password">
                Password: 
                <input type="password" name="password" required minLength="4"  value={formData.password} onChange={updateForm}/>
            </label>

            <label htmlFor="password2">
                Retype password: 
                <input type="password" name="password2" required minLength='3' value={formData.password2} onChange={updateForm}/>
            </label>
            <button>
                Sign Up
            </button>
            <p>
                Already have an account ?
                    <Link to="/signin">
                        Sign in here
                    </Link>
            </p>
        </form>
    )
}

export default function SignUpPage(props){
    return (
        <>
            <NavigationBar active='signup' />
            <SignUpForm />
        </>
    )
}