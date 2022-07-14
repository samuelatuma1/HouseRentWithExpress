import {useState} from 'react';
import './signup.css'
import NavigationBar from '../../components/navigation'

// Import Global User state to set User
import {SetUser} from "../../store/atoms"

// Import 
import  {useSetRecoilState} from "recoil";

// Routing tool

import {Link, useNavigate, useParams, useSearchParams} from 'react-router-dom'
/**
 * @param ?next=SomeValue
 * @param {*} props 
 * @returns 
 */
function SignInForm(props){

    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParams()

    // Navigates users to actual page they visited if 
    // signed in correctly
    const next = searchParams.get("next")
    
    
    // Organize All form Data 
    const [formData, setFormData] = useState({
        email: "", 
        password: ""
    })

    // Handle form Errors
    const [formErrs, setFormErrs] = useState([])

    // set up navigation tool
    const navigate = useNavigate()

    // Global User state Manager
    const StoreUser = useSetRecoilState(SetUser)
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
        
    
        // Submit form to server
        let formBody = formData
        const signInReq = await fetch("/auth/signin", {
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
        if(signInReq.ok){
            const signInRes = await signInReq.json()            
            // Set User globally in app
            StoreUser(signInRes)
            
            // Redirect to home page
            // Redirect to next if any
            if(next){
                // Navigates users to actual page they visited if 
                // signed in correctly
                navigate(next)
            } else{
                navigate("/home")
            }
            
    } else{
        // If server sends a 404 response
        setFormErrs([{"msg": "email or password invalid"}])
    }

}

    
    return (
        <form onSubmit={submitUserForm} className="Authform">
            <h1>Sign In to House Rent</h1>
            {
                formErrs.map((err, id) => (
                    <li className="formErr" key={id}>
                        {err.msg}
                    </li>
                ))
            }
            {
                formSuccess.map((data, id) => (
                    <li className="formSuccess" key={id}>
                        {data.msg}
                    </li>
                ))
            }
            <label htmlFor="email">
                Email: 
                <input type="email" name="email" required value={formData.email}  onChange={updateForm}/>
            </label>

            <label htmlFor="password">
                Password: 
                <input type="password" name="password" required minLength="4"  value={formData.password} onChange={updateForm}/>
            </label>

            <button>
                Sign In
            </button>
            <p>
                Don't  have an account? 
                    <Link to="/signup">
                        Sign up here
                    </Link>
            </p>
        </form>
    )
}

export default function SignInPage(props){
    return (
        <>
            <NavigationBar active='signin' />
            <SignInForm />
        </>
    )
}