import {
    Link
} from "react-router-dom"
import {useEffect, useRef} from "react";
// Style sheet
import '../styles/navigation.css';

const arrowDownSvg = (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square" viewBox="0 0 16 16">
<path  d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>

</svg>)
/**
 * @desc gives HTMLElement in navBar with className matching whatever value passed as active in props a class of active
 * @example <NavigationBar active='signin' /> :-> Gives HTMLElement with className signin a class of active
 * @param {*} props 
 * @returns 
 */
export default function NavigationBar(props){
    const navBar = useRef()
    const toggleNavRef = useRef()
    useEffect(() => {
        
        /**
         * @desc Removes hide class from toggleDisplay on big screen size
         */
        function removeIfQueryMatches(screenSize){
            if (screenSize.matches){
                const display = toggleNavRef;
                display.current.classList.remove("hide");
            }
        }
        let screenSize = window.matchMedia("(min-width: 600px)")
        
        // Continually listen for screen size change
        removeIfQueryMatches(screenSize)
        screenSize.addEventListener("change", removeIfQueryMatches);

        // Style the active link
        styleActive()
        return function(){
            screenSize.removeEventListener("change", removeIfQueryMatches)
            
        }
    })


    /**
     * @type event Handler
     * @desc toggles display of navbar menu for mobile devices
     */
    function toggleDisplay(event){
        const display = toggleNavRef;
        
        display.current.classList.toggle("hide");
    }

    /**
     * @desc Searches for the first element whose classList includes @param find, adds active class to element
     * @params {element} The  html element we wish to explore,
     * @params {find} the className we want to add active to
     */
    function exploreElem(element, find){
        if (element.classList.contains(find)){
            element.classList.add('active')
            return
        }
            
        for(let child of element.children){
            exploreElem(child, find)
        }
    }
    /**
     * @desc Get what part in the navigation we are in
     */
    function styleActive(){
        let nav = navBar.current

        // Get the active data
        let active = props.active || 'home'
        exploreElem(nav, active)

    }


    return (
        <nav ref={navBar}>
            <section className="home">
            <li>Home</li>
            <i onClick={toggleDisplay}>
            {arrowDownSvg}
            </i> 
            </section>
            
            <ul className="toggleDisplay hide" ref={toggleNavRef}>
            <section className='houseNav'>
                <li>Upload House</li>
                <li>Upload House</li>
            </section>

            <section className='auth'>
                <li>Sign In</li>
                <li className='signup'>Sign Up</li>
            </section>

            </ul>                    
        </nav>
    )
}