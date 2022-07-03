import {useState, useEffect} from 'react';
import {User, Users, AddUser} from './store/atoms.js';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';

// Pages
import SignUpPage from './pages/auth/signup.js'

import  SetUser from './components/changeUser';
import SetDefault from './components/defaultUser.js'
/**
 * @desc Reference for understanding and working with recoil
 */
function Reference() {
  const user = useRecoilValue(User);
  const adduser = useSetRecoilState(AddUser)
  const users = useRecoilValue(AddUser)
  function addUserEvent(e){
    adduser("Udofia")

  }
  return (
    <div className="App">
      <h1>Hello, world. Signed in as {user}</h1>
      < SetUser />
      <SetDefault />

      {/*  Many Users */}
      <h1>All Users</h1>
      {
        users.map((user, id) => (
          <li key={id}>{user}</li>
        ))
      }

      <button onClick={addUserEvent}>Add Udofia to Userss</button>
    </div>
  );
}
function App(){
  // let [test, setTest] = useState(null)

    
  return (
   <>
    <SignUpPage />
   </>
  )
}
export default App;
