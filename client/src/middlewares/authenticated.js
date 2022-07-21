/**
 * @desc Returns Boolean (true) if user is authenticated, else false.
 * @useage Example const signedIn = useIsAuthenticated()
 * @returns Boolean 
 */
export default async function useIsAuthenticated(){
    const authRequest = await fetch(`/auth/isAuthenticated`)
    if(authRequest.ok){
        const authenticatedRes = await authRequest.json()
        return authenticatedRes.isAuthenticated ? true : false
    }
    return false
}