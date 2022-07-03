import {User} from '../store/atoms.js';
import {useRecoilState} from 'recoil';
import {useRef, useState, useEffect} from 'react';
export default function SetUser (props) {
    const [user, setUser] = useRecoilState(User)
    const inputRef = useRef()
    useEffect(() => {
        inputRef.current.value = user
    }, [user])
    function update(e){
        
        inputRef.current.style.backgroundColor = 'yellow'
        console.log(inputRef)
        
        inputRef.current.value = e.target.value
    }
    const updateUser = (e) => {
        e.preventDefault()
        setUser(prevData => inputRef.current.value)
    }
    const changeUser= (<>
        <form onSubmit={updateUser}>
            <input type='text' ref={inputRef} onChange={update} />
            <button>Change User</button>
        </form>
    </>)

    return changeUser

}