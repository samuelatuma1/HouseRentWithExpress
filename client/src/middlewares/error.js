import "./error.css"

/**
 * @props {msg: String}
 */
export default function ErrorPage(props){
    const errorMsg = props.msg || "An error occured"
    return (
        <>
            <div className="errorPage">
                <h1>{errorMsg}</h1>
            </div>
        </>
    )
}