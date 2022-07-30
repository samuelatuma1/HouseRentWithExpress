import {useParams, Navigate} from "react-router-dom";
import {useState, useEffect, createContext, useContext, useRef} from "react";
import ErrorPage from "../../../middlewares/error.js";
import Loading from "../../../middlewares/loading.js"


// Authentication
import useIsAuthenticated from "../../../middlewares/authenticated"

const HouseContext = createContext()


function PropertyInfo(props){
    // Create form to desc
    
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const houseId = props.houseId
    const [house, setHouse] = useContext(HouseContext)
    const [descForm, setDescForm] = useState({
        description:( house && house.description)  || "",
        bedrooms:( house && house.bedrooms) || "0",
        bathrooms: ( house && house.bathrooms ) || "0",
        size: ( house && house.size ) || "" 
    })

    const formRef = useRef()
    const updateDescForm = (e) => {
        console.log(e.target)
        const inputName = e.target.name
        const inputData = e.target.value
        setDescForm(prevData => ({...prevData, [inputName]: inputData}))


    }
    useEffect(() => {
        console.log(house)
    }, [house])
    const updateHouseDesc = async (e) => {
        try{
            e.preventDefault()
        // submit data to backend
            setLoading(true)
            const updateReq = await fetch(`/house/upload/${houseId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(descForm)
            })
            setLoading(false)
            if(updateReq.ok){
                // Update houseObject with Response
                const updatedHouse = await updateReq.json()
                setHouse(updatedHouse)
            } else{
                setError(true)
            }
            
        } catch(err){
            setError(true)
        }


    }

    function toggleDisplay(e){
        const formDetails = formRef.current
        formDetails.classList.toggle("hide");
    }
    if(loading){
        return <Loading />
    }
    if(error){
        return <ErrorPage msg="Something went wrong while updating Property Info" />
    }


    return (
        <>
            
            
            <form className="form" onSubmit={updateHouseDesc}>

            <h2>Update Property Info <button type="button" onClick={toggleDisplay}>Display Property Info</button></h2>

            <div className="toggleFormDisplay hide" ref={formRef}>
            <label htmlFor="description">
                    Description:
                    <textarea name="description"
                    value={descForm.description}
                    onChange={updateDescForm}
                    />
                </label>

                <label htmlFor="bedrooms">
                    Bedrooms:
                    <input name="bedrooms"
                    value={descForm.bedrooms}
                    type="number"
                    min="0" max="20"
                    onChange={updateDescForm}
                    />
                </label>

                <label htmlFor="bathrooms">
                    Bathrooms:
                    <input name="bathrooms"
                    value={descForm.bathrooms}
                    type="number"
                    min="0" max="20"
                    onChange={updateDescForm}
                    />
                </label>

                <label htmlFor="size">
                    Size:
                    <input name="size"
                    value={descForm.size}
                    type="number"
                    min="0" max="20"
                    onChange={updateDescForm}
                    />
                </label>
                <button>Update Description and Continue</button>
            </div>
            </form>
        </>
    )
}



function ListingDetails(props){
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const houseId = props.houseId
    const [house, setHouse] = useContext(HouseContext)
    const [listing, setListing] = useState({
        amount: (house && house.amount) || "0",
        rentPaid: (house && house.rentPaid) || "annum",
        securityDeposit: (house && house.securityDeposit) || "0",
        availableForRent: (house && house.availableForRent) || "true"

    })
    
    const formRef = useRef()
    function toggleDisplay(e){
        const formDetails = formRef.current
        formDetails.classList.toggle("hide");
    }

    const updateHListing = async (e) => {
        try{
            e.preventDefault()
        // submit data to backend
            setLoading(true)
            const updateReq = await fetch(`/house/upload/${houseId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    
                },
                body: JSON.stringify(listing)
            })
            setLoading(false)
            if(updateReq.ok){
                // Update houseObject with Response
                const updatedHouse = await updateReq.json()
                setHouse(updatedHouse)
            } else{
                setError(true)
            }
            
        } catch(err){
            setError(true)
        }
    }
    function updateListing(e){
        setListing(prevData => ({...prevData, [e.target.name]: e.target.value}))
    }

    // Rendering
    if(loading){
        return <Loading />
    }
    if(error){
        return <ErrorPage msg="Something went wrong while updating Property Info" />
    }
    return (
        <>
            <form className="form" onSubmit={updateHListing}>
                <h2>Update Listing Details <button type="button" onClick={toggleDisplay}>Display Listing Details</button></h2>

                <div ref={formRef} className="hide">
                    <label htmlFor="amount">
                        <h3>How much is the rent?</h3>
                        Rent: 
                        <input name="amount" type="number" min="0" max="10000000"
                        value={listing.amount}
                        onChange={updateListing}
                        />
                    </label>

                    <label htmlFor="amount">
                        Rent Paid Per: 
                        <select name="rentPaid" value={listing.rentPaid} 
                        onChange={updateListing}>
                            <option value="week">week</option>
                            <option value="month">month</option>
                            <option value="annum">annum</option>
                        </select>
                    </label>

                    <label htmlFor="securityDeposit">

                        <h3>How much is the security deposit? </h3>
                        <p>Amount generally shouldn't exceed 150% of the base rent.</p>
                        Security deposit:
                        <input name="securityDeposit" type="number" min="0" max="10000000"
                        value={listing.securityDeposit}
                        onChange={updateListing}
                        />
                    </label>

                    <label for="availableForRent">
                        <h3>
                        Is your property available for rent?
                        </h3>
                        <select name="availableForRent"
                        value={listing.availableForRent}
                        onChange={updateListing}>
                            <option value="true">
                                Yes
                            </option>
                            <option value="false">No</option>
                        </select>
                    </label>
                    <button>Update Listing and Continue</button>
                </div>

            </form>
        </>)
}

function Lease(props){
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const houseId = props.houseId
    const [house, setHouse] = useContext(HouseContext)
    const [lease, setLease] = useState({
        duration: (house && house.lease) || "1 month",
        leaseDescription: (house && house.leaseDescription) || ""
    })
    const formRef = useRef()
    function toggleDisplay(e){
        const formDetails = formRef.current
        formDetails.classList.toggle("hide");
    }

    const submitUpdatedLease = async (e) => {
        try{
            e.preventDefault()
        // submit data to backend
            setLoading(true)
            const updateReq = await fetch(`/house/upload/${houseId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    
                },
                body: JSON.stringify(lease)
            })
            setLoading(false)
            if(updateReq.ok){
                // Update houseObject with Response
                const updatedHouse = await updateReq.json()
                setHouse(updatedHouse)
            } else{
                setError(true)
            }
            
        } catch(err){
            setError(true)
        }
    }

    function updateLease(e){
        setLease(prevData => ({...prevData, [e.target.name]: e.target.value}))
    }

    // Rendering
    if(loading){
        return <Loading />
    }
    if(error){
        return <ErrorPage msg="Something went wrong while updating Property Info" />
    }


    return (
        <>
            <form className="form" onSubmit={submitUpdatedLease}>
                <h2>Update Lease Details <button type="button" onClick={toggleDisplay}>Display Lease Details</button></h2>

                <div ref={formRef} className="hide">
                    <label for="duration">
                        <h3>What is the duration of the Lease*</h3>
                            <select value={lease.duration} onChange={updateLease}
                            name="duration"
                            >
                                <option value="1 month">1 month</option>
                                <option value="6 months">6 months</option>
                                <option value="1 year">1 year</option>

                                <option value="rent to own">Rent to own</option>
                                <option value="sublet/temporary">
                                    Sublet/temporary
                                </option>
                            </select>
                    </label>        
                    <label for="leaseDescription">
                        <h3>What should renters know about the lease terms? </h3>
                        <textarea name="leaseDescription" 
                        value={lease.leaseDescription} onChange={updateLease}
                        placeholder="Ex. No smoking is allowed, Last month's rent due at signing. Small pets allowd"
                        />
                    </label>

                    <button>Update lease and continue</button>
                </div>
            </form>
        </>)
}



function Next(props){
    const formRef = useRef()
    function toggleDisplay(e){
        const formDetails = formRef.current
        formDetails.classList.toggle("hide");
    }
    return (
        <>
            <form className="form">
                
            </form>
        </>)
}
function HouseImage(props){
    const imgObject = props.imgObject
    const [imgDesc, setImgDesc] = useState(imgObject.description)
    const [deleted, setdeleted] = useState(false)
    function updateDescription(e){
        setImgDesc(e.target.value)
    }
    console.log(imgObject)
    async function updateCaption(e){
        // Updates caption for Image
        const updateCaptionReq = await fetch(`/house/houseImgs/${imgObject._id}`,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({description: imgDesc})
        })
        if(updateCaptionReq.ok){
            alert("Updated")
        }else{
            alert("An error occured")
        }
    }

    async function deleteImage(e){
        const deleteHouseImg = await fetch(`/house/houseimgs/${imgObject._id}`, {
            method: "DELETE"
        })

        if(deleteHouseImg.ok){
            alert("Successfully deleted")
        } else{
            console.log(deleteHouseImg)
            alert("An error occurred while attempting to delete the image")
        }
        setdeleted(true)
    }
    if(deleted){
        return <></>
    }
    return (<div className="houseImage">
            <img 
            src={imgObject.imgPath} alt={imgObject.description}
            />
            <main>
               <label htmlFor="description">
                    <h3>Update Caption</h3>
                    <textarea name="description" value={imgDesc} onChange={updateDescription} />
                    <section className="updateImg">
                        <button onClick={updateCaption} type="button">Update Caption</button>
                        <button type="button" onClick={deleteImage}>Delete Image</button>
                    </section>
                </label>
               </main>
    </div>)
}
function UpdateHouseImage(props){
    const formRef = useRef()
    const houseId = props.houseId

    // Get already Uploaded Images
    const [houseImgs, setHouseImgs] = useState([])

    async function getHouseImgs(){
        const imgReq = await fetch(`/house/houseimgs/${houseId}`)
        if(imgReq.ok){
            const imgRes = await imgReq.json()
            setHouseImgs(imgRes)
        }
    }
    useEffect(() => {
        getHouseImgs()
    }, [])
    // Manage loading asset
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    // Get House Images

    // State for managing the form
    const [houseImg, sethouseImg] = useState()
    const [description, setDescription] = useState("")
    const [selected, setSelected] = useState(false)

    
    function toggleDisplay(e){
        const formDetails = formRef.current
        formDetails.classList.toggle("hide");
    }


    function selectFileHandler(e){
        sethouseImg(e.target.files[0])
        setSelected(true)
    }
    useEffect(() => {
        console.log(houseImg)
    }, [houseImg])

    function changeDescHandler(e){
        setDescription(e.target.value)
    }

    async function submitUploadedImg(e){
        e.preventDefault()
        // If no image, report error
        if(!selected){
            alert("Please add an image first")
            return
        }
        // Create form data
        const formData = new FormData()
        formData.append("houseImg", houseImg)
        formData.append("description", description)
        
        // Submit formData
        setLoading(true)
        const submitImgReq = await fetch(`/house/uploadimg/${houseId}`, {
            method: "POST",
            body: formData
        })
        setLoading(false)
        if(submitImgReq.ok){
            // Clear input and description
            setDescription("")
            setSelected(false)
            sethouseImg(null)
            alert("successful")
            // call getHouse to reflect changes
            getHouseImgs()
            console.log(await submitImgReq.json())
        } else{
            setError(true)
        }

    }
    if(loading){
        return <Loading />
    }
    if(error){
        return <ErrorPage />
    }
    return (
        <>

            <form className="form" onSubmit={submitUploadedImg}>
                <h2>
                    Add Photos
                        <button type="button" onClick={toggleDisplay}>
                            Display Photo Listing
                        </button>
                </h2>

                <div ref={formRef} className="hide">
                <section className="houseImages">
                    {
                        houseImgs.map(imgObject => (
                            <HouseImage imgObject={imgObject} />
                        ))
                    }
                </section>
                    
                    <label htmlFor="houseImg">
                        <h3>Photos help renters imagine living in your place</h3>
                        <input type="file" name="houseImg" accept="image/*"
                        onChange={selectFileHandler}
                        />
                    </label>

                    <label htmlFor="description">
                        <h3>Caption</h3>
                        <textarea name="description" value={description}
                        onChange={changeDescHandler}
                        placeholder="Describe this photo"
                        />
                    </label>
                    <button>Upload House Image</button>
                </div>
            
            </form>
        </>)
}

function UpdateHouse(props){
    const params = useParams()
    const houseId = params.houseId
    // Fetch House data with matching id
    const [house, setHouse] = useState(null);
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)

    // get signed In User
    const signedIn = useIsAuthenticated()


    // get House
    async function getHouse(){
        try{
            setLoading(true)

            const houseReq = await fetch(`/house/upload/${houseId}`, {
                headers: {
                    "authorization": signedIn && `Bearer ${signedIn.token}`
                }
            })
            if(houseReq.ok){
                let houseData = await houseReq.json()
                setLoading(false)
                setHouse(houseData)
            } else{
                setLoading(false)
                setError(true)
            }

        } catch(err){
            setLoading(false)
            setError(true)
        }
    }

    useEffect(() => {
        getHouse()
    }, [])
    console.log("signed in", {signedIn})
    if(!signedIn){
        return <Navigate to={`/signin?next=/house/update/${houseId}`} />
    }
    else{
    if(loading)
        return <Loading />
    else if(error)
        return <ErrorPage  />
    else
        return (<HouseContext.Provider value={[house, setHouse]}>
            <PropertyInfo houseId={houseId} />
            <ListingDetails houseId={houseId} />
            <Lease houseId={houseId} />
            <UpdateHouseImage houseId={houseId} />
        </HouseContext.Provider>)
    }
}

export default UpdateHouse