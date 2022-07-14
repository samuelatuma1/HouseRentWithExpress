import {useState, useRef} from "react";
import {Link, Navigate} from "react-router-dom";
import "./adminCity.css";
import NavigationBar from '../../../components/navigation'
import {useIsAdmin} from "../middleware/isAdmin"
// Necessary to access if Globally signed in User is Admin


function AddCity(props){
    // Set error for forms
    const [serverMsg, setServerMsg] = useState("")
    const [cityForm, setCityForm] = useState({
        city: "",
        state: "",
        country: ""
    })
    const addCityForm = useRef()
    async function addCity(e){
        e.preventDefault()
        

        // Verify data is clean
        for(let fieldName in cityForm){
            const cityValue = cityForm[fieldName].trim()
            if(cityValue.length === 0){
                alert(`Please, fill out the field ${fieldName}`)
                return 
            }
        }

        // If data is valid, send
        const addCityRequest = await fetch("/admin/city", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(cityForm)
        })
        if(addCityRequest.ok){
            const addCityResponse = await addCityRequest.json()
            setServerMsg(addCityResponse.msg || "City successfully added")
        } else{
            alert("Something went wrong with the server, please try again")
        }
    }

    function updateInput(e){
        setCityForm(prevData => ({...prevData, [e.target.name]: e.target.value}))
    }
    function toggleAddCityForm(e){
        addCityForm.current.classList.toggle("hide")
    }
    return (
        
          <div className="toggleAddCityView">
            <h2>
                <span>Add City</span>
                <button className="toggle" onClick={toggleAddCityForm}> Add </button>
            </h2>

            <form ref={addCityForm} className="Authform hide" onSubmit={addCity}>
                    {serverMsg ? 
                        <div className="formSuccess">{serverMsg}</div> : <></>
                    }
                    <label htmlFor="city">
                        City: 
                        <input name="city" minlength="1" value={cityForm.city} onChange={updateInput}/>
                    </label>

                    <label htmlFor="state" >
                        State: 
                        <input name="state" minlength="1" value={cityForm.state} onChange={updateInput}/>
                    </label>

                    <label htmlFor="country" onChange={updateInput}>
                        Country:
                        <input name="country" minlength="1" value={cityForm.country}/>
                    </label>

                    <button>
                        Add City
                    </button>
            </form>
        </div>
    )
}
// Create display for cities returned from a search
// const Example =  [
//   {
//     _id: "62c7b2357aaa41d3ab5f4431",
//     city: 'Lagos',
//     state: 'Lagos',
//     country: 'Nigeria',
//     __v: 0
//   }
// ]

function DisplaySearch(props){

    const cities = props.cities
    if(!cities){
        return <></>
    }
    const display = cities.length > 0 ? 
        (
            <div className='cityDiv'>
            <table>
              <caption>Search Result</caption>
              <thead>
                <tr>
                  <th>City</th>
                  <th>State</th>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
                  {
                    cities.map( (city, idx) => (
                      <tr key={idx}>
                        <td>
                            <Link to={`/admin/city/${city._id}`}>
                            {city.city}
                            </Link>
                        </td>
                        <td>{city.state}</td>
                        <td>{city.country}</td>
                      </tr>
                    ))
                  }
              </tbody>
            </table>
          </div>

     )  : <>
                  <h2 style={{textAlign: 'center'}}>
                    No Search Result 
                  </h2>
        </>
        
    return display
}

const SearchCity = (props) => {
    // 
    const [errMsg, setErrMsg] = useState("")
    const [searchTerm, setSearchTerm] = useState({
        searchCity: "",
        by: "all"
    });
    const [searchRes, setSearchRes] = useState(null);
    
    async function searchCity(e){
        e.preventDefault()
        // Remove trailing white space from searchCity
        const search = searchTerm.searchCity.trim()
        // Verify something is written in search
        if(!search){
            setErrMsg("Invalid city")
            // Remove errMsg after 3 seconds
            setTimeout(() => {
                setErrMsg("")
            }, 3000)
            return
        }

        // Fetch City matches
        const citySearchUrl = `search?by=${searchTerm.by}&search=${searchTerm.searchCity}`
        const req = await fetch(citySearchUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (req.ok){
            const res = await req.json()
            
            setSearchRes(res)
        }
    }
    
    function updateSearch(e){
        const val = e.target.value;
        setSearchTerm(prevData => ({...prevData, [e.target.name]: val}))
        
        console.log(searchTerm)
    }
    const cityForm =  (<>
        <h2 className="desc">Search City</h2>
        <form className="adminCityForm" onSubmit={searchCity}>
           <label htmlFor="searchCity">
            <input name="searchCity" type="text" minLength="1" onChange={updateSearch} value={searchTerm.searchCity}/>

            <select value={searchTerm.by} onChange={updateSearch} name="by">
                <option value="all">All</option>
                <option value="city">By City</option>
                <option value="state">By State</option>
                <option value="country">By Country</option>
            </select>
            <button>Search City</button>
            {/* Handle input error */}
            {
                errMsg ? 
                    <div className="inputErr">{errMsg}</div> :
                    <></>
            }
           </label>
        </form>
    </>
    )

    return (
        <>
            <AddCity />
            {cityForm}
            <DisplaySearch cities={searchRes} />
        </>
    )
}





function AdminCity(props){
        const userIsAdmin = useIsAdmin()
    
        return userIsAdmin ? (
            <>
            
              <NavigationBar />
             <SearchCity />
            </>
         ) : <Navigate to="/signin?next=/admin/city" />
        }
        
    

export default AdminCity