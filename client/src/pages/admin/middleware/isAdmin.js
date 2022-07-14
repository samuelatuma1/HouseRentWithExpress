import {useRecoilValue} from "recoil";
import {SetUser} from "../../../store/atoms"

function useIsAdmin(){
    // Access User
    const user = useRecoilValue(SetUser)
    if(!user){
        return false
    }
    if(user.isAdmin){
    
        return true
    } 
    return false
}

export {useIsAdmin}