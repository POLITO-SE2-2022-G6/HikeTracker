import s from './Index.module.css';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Layout from '../../components/layout/Layout';
import Login from '../login/Login';
import Register from '../register/Register';
import HikesSearchPage from '../hikes/HikesSearchPage';
import HikeForm from '../hikeForm/HikeForm';

import { UserContext, UserContextWrapper } from '../../context/userContext';
import { useContext } from 'react';
import { Landing } from '../landing/Landing';
import HikeDetailPage from '../hike/HikeDetailPage';


const Index: React.FC = () => {

  const { state, setState } = useContext(UserContext);

  const { loggedIn } = state;

  return (
    <>
      <UserContextWrapper>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Layout />} >
              <Route path='hikes' element={<HikesSearchPage />} />
              <Route path='' element={<Landing />} />
              <Route path='/hike/:id' element={<HikeDetailPage />} />
              <Route path='/hike/edit/:id' element={<></>} />
              <Route path='/hike/edit/' element={<HikeForm />} />

            </Route>
            <Route path='/login' element={loggedIn
              ? <Navigate to='/' />
              : <Login />} />
            <Route path='/register' element={<Register></Register>} />
          </Routes>
        </BrowserRouter>

      </UserContextWrapper>
    </>
  );
};

export default Index;

/*
A '/' bisogna passare loggedIn user, setFlag1 e doLogOut
A '/login' bisogna passare doLogIn
A '/register' bisogna passare doRegistration
*/
