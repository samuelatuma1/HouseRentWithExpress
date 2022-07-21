import "./loading.css"
/**
 * 
 * @param {} props 
 * @returns loading asset 
 */
 export default function Loading(props){
    return (
        <div className="loadingDiv">
            <span className="spinner"></span>
            <span className="spinner"></span>
            <span className="spinner"></span>
        </div>
    )
}