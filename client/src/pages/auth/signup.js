import './signup.css'
import NavigationBar from '../../components/navigation'

function SignUpForm(props){


    return (
        <form>
            <h1>Sign Up to House Rent</h1>
            <label htmlFor="fullName">
                Full Name: 
                <input type="text" name="fullName" placeholder="first_name last_name" required minLength='3'/>
            </label>

            <label htmlFor="email">
                Email: 
                <input type="email" name="email" required/>
            </label>

            <label htmlFor="password">
                Password: 
                <input type="string" name="password" required minLength="4"/>
            </label>

            <button>
                Sign Up
            </button>
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