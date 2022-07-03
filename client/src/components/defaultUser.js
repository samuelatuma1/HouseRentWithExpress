import {useSetRecoilState} from 'recoil';
import {SetUser} from '../store/atoms.js'
export default function SetDefault(props){
    const changeUser = useSetRecoilState(SetUser);
    function setAnonymous(e){
        changeUser('Peter Pan')
        e.target.style.backgroundColor = 'red';
    }
    const btn = (
        <button onClick={setAnonymous}>Set to Anonymous</button>
    )
    return btn
}