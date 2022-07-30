import {User} from "../store/atoms.js"
import {useRecoilValue} from "recoil";
export async function authenticate(){
    const authRequest = await fetch(`/auth/isAuthenticated`)
    if(authRequest.ok){
        const authenticatedRes = await authRequest.json()
        return authenticatedRes.isAuthenticated ? true : false
    }
    return false
}
/**
 * @desc Returns user Object {fullName: string, email: string, token: JwtToken} or null
 * @useage Example const signedIn = useIsAuthenticated()
 */
export default function useIsAuthenticated(){
    const user = useRecoilValue(User)
    return user 
}