import {useState, useEffect} from 'react';
import {User, Users, AddUser} from './store/atoms.js';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';

// Routing tools import
import {
  Routes, BrowserRouter, Route
} from "react-router-dom"

// Pages
import SignUpPage from './pages/auth/signup.js'
import SignInPage from './pages/auth/signin.js'

// House pages
import UploadHouse from "./pages/house/upload.js"

// Admin Pages
import AdminCity from  './pages/admin/city/adminCity'
import GetCity from  './pages/admin/city/getCity';

import  SetUser from './components/changeUser';
import SetDefault from './components/defaultUser.js'

function App(){    
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/signin' element={<SignInPage />} />
        {/* <Route path='/signin/:next' element={<SignInPage />} /> */}
        <Route path="/admin/city" element={<AdminCity />} />
        <Route path="/admin/city/:id" element={<GetCity />} />
        <Route path="/uploadHouse" element={<UploadHouse />} />
      </Routes>
    </BrowserRouter>
   
  )
}
export default App;























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
