import {useParams} from "react-router-dom";
import {useEffect, useState, useRef} from "react";
import "./getCity.css";
/**
 * 
 * @param {} props 
 * @returns loading asset 
 */
function Loading(props){
    return (
        <div className="loadingDiv">
            
            <span className="spinner"></span>
            <span className="spinner"></span>
            <span className="spinner"></span>
        </div>
    )
}



function GetCity(props){
    const [cityDetails, setCityDetails] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const params = useParams()
    const cityId = params.id

    // Edit City Form
    const [editCityForm, setEditCityForm] = useState({
        city: "",
        state: "",
        country: ""
    })

    // References edit form lement
    const editFormElement = useRef()

    const cityUrl = `/admin/city/${cityId}`


    // Fetch city with id
    async function fetchCity(){
        console.log(cityUrl)
        // set loading to true
        setLoading(true)
        const city = await fetch(cityUrl)
        if(city.ok){
            const cityRes = await city.json()
            // Clear Error and Loading
            setError(false)
            setLoading(false)
            // Populate city Details
            console.log(cityRes)
            setCityDetails(cityRes)
            // Update edit Form too
            setEditCityForm(cityRes)
        }
        else{
            // Clear loading and cityDetails
            setLoading(false)
            setCityDetails(false)

            // set Error to true
            setError(true)
        }
    }

    // Use effect to 
    useEffect(() => {
        fetchCity()
    }, [])
    // Deletes city with id
    async function deleteCity(e){
        const deleteRequest = await fetch(cityUrl, {
            method: "DELETE"
        })
        if(deleteRequest.ok){
            alert("City deleted successfully")
        }
    }
    
    // Edit City function
    async function submitChanges(e){
        // 
        e.preventDefault()
        // Remove __v and _id from form editCityForm
        setEditCityForm(prevData => {
            const updateProperties = prevData
            delete updateProperties["_id"]
            delete updateProperties["__v"]
            return updateProperties
        })

        // Send Edited city form 
        const reqUpdate = await fetch(cityUrl, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(editCityForm)
        })

        if (reqUpdate.ok){
            // Update cityDetails to reflect editCityorm changes
            setCityDetails(prevDetails => ({...prevDetails, ...editCityForm}))
            alert("Update successful")
            
        } else{
            alert("City failed to update")
        }


        
        
    }
    // Update form input on change
    function updateInput(e){
        const inputName = e.target.name
        const inputValue = e.target.value
        setEditCityForm(prevData => ({...prevData, [inputName] : inputValue}))
    }

    function toggleEdit(e){
        editFormElement.current.classList.toggle("hide")
    }
    if(loading){
        return (<Loading />)
    } else if (error){
        return (<h1>
            The City you are looking for cannot be found
            </h1>)
    } else if(cityDetails){
        return (
            <div className='cityDiv'>
                <table>
                  <caption>City</caption>
                  <thead>
                    <tr>
                      <th>City</th>
                      <th>State</th>
                      <th>Country</th>
                    </tr>
                  </thead>
                  <tbody>
                        <tr>
                            <td>
                                {cityDetails.city}
                            </td>
                            <td>{cityDetails.state}</td>
                            <td>{cityDetails.country}</td>
                        </tr>
                        <tr className="modifyCity">
                            <button onClick={toggleEdit}>
                                Edit City
                            </button>

                            {/* <button onClick={deleteCity}>
                                Delete City
                            </button> */}
                            
                        </tr>
                  </tbody>
                </table>
                <form ref={editFormElement} className="Authform" onSubmit={submitChanges}>
                    <label htmlFor="city">
                        City: 
                        <input name="city" minlength="1" value={editCityForm.city} onChange={updateInput} required />
                    </label>

                    <label htmlFor="state" >
                        State: 
                        <input name="state" minlength="1" value={editCityForm.state} onChange={updateInput} required />
                    </label>

                    <label htmlFor="country" onChange={updateInput}>
                        Country:
                        <input name="country" minlength="1" value={editCityForm.country} required/>
                    </label>

                    <button>
                        Edit Current City
                    </button>
                </form>
              </div>
        )
    }
}



export default GetCity