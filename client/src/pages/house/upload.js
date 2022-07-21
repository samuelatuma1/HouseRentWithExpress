import useIsAuthenticated from "../../middlewares/authenticated"
import { Navigate } from "react-router-dom"

// Import loading asset
import Loading from "../../middlewares/loading.js";
export default function UploadHouse(props){
    const signedIn = useIsAuthenticated()

    return signedIn ? <Loading /> : <Navigate to="/signin" />
    
}