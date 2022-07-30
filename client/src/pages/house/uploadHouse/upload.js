import useIsAuthenticated, {authenticate} from "../../../middlewares/authenticated"
import { Navigate, useNavigate } from "react-router-dom"
import {useState} from "react";
import "./upload.css"
// Import loading asset
import Loading from "../../../middlewares/loading.js";

export default function UploadHouse(props){
            
    const navigate = useNavigate()
    const signedIn = useIsAuthenticated()
    const [fetching, setFetching] = useState(false)
    const [houseUploadForm, setHouseUploadForm] = useState({
        streetAddress: "",
        propertyType: "house"
    })
    function updateHouseUploadForm(e){
        const targetName = e.target.name
        const targetValue = e.target.value
        setHouseUploadForm(prevData => ({...prevData, [targetName]: targetValue}))
    }
    function validateUploadForm(){
        const {streetAddress, propertyType} = houseUploadForm
        // validate street address
        const street = streetAddress.trim()
        if(street.length <= 0){
            return false;
        } 
        const acceptedPropertyType = ["house", "condo", "townhouse", "entire apartment"]
        if(!acceptedPropertyType.includes(propertyType)){
            return false
        }

        return true
    }
    async function uploadHouse(e){
        e.preventDefault()

        // Do client side validation
        const formIsValid = validateUploadForm()
        if(!formIsValid){
            alert("Some fields are invalid")
            return
        } 

        // If valid submit uploaded House
        setFetching(true)
        const uploadHouseRequest = await fetch("/house/upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": signedIn ? `Bearer ${signedIn.token}`: null
            },
            body: JSON.stringify(houseUploadForm)
        })

        if(uploadHouseRequest.ok){
            setFetching(false)
            // Redirect to new page after getting house address
            const res = await uploadHouseRequest.json()
            console.log(res)
            navigate(`/house/update/${res.house._id}`)

        } else{
            alert("An error occured, please try again")
            setFetching(false)
        }

    }

    const loading = <Loading /> 
    const form = (
        <form className="form" onSubmit={uploadHouse}>
            <h1>Upload House</h1>
            <label htmlFor="streetAddress">
                House Address: 
                <textarea  name="streetAddress"
                value={houseUploadForm.streetAddress}
                onChange={updateHouseUploadForm}
                />
            </label>
           
            <label htmlFor="propertyType">
                House Type: 
                <select value={houseUploadForm.propertyType}
                    name="propertyType" onChange={updateHouseUploadForm}>
                        <option value="house">House</option>
                        <option value="condo">Condo /Apartment Unit</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="entire apartment">Entire Apartment</option>
                </select>
            </label>
            <br/>
            <button>Get Started</button>
        </form>
    )
    return (signedIn ? (fetching ? loading : form) 
        : <Navigate to="/signin?next=/house/upload" />
        )  
}