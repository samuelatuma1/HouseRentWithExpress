import {useState} from "react";
const SearchCity = (props) => {
    // 
    const [searchTerm, setSearchTerm] = useState({
        "searchCity": ""
    })
    function searchCity(e){

    }
    return (<>
        <form onSubmit={searchCity}>
           <label htmlFor="searchCity">
            <input type="text" minLength="1" />
            <button>Search City</button>
           </label>
        </form>
    </>
    )
}



function AdminCity(props){
    return (
        <SearchCity />
    )
}

export default AdminCity