import s from './Index.module.css';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Layout from '../../components/layout/Layout';
import Login from '../login/Login';
import Register from '../register/Register';
import HikesSearchPage from '../hikes/HikesSearchPage';

import { UserContext, UserContextWrapper } from '../../context/userContext';
import { useContext } from 'react';
import { Landing } from '../landing/Landing';


const Index: React.FC = () => {

  const { state, setState } = useContext(UserContext);

  const { loggedIn } = state;
  // const [loggedIn, setLoggedIn] = useState(false);
  // const [user, setUser] = useState({});
  // const [hikesList, setHikesList] = useState({});
  // const [flag1, setFlag1] = useState(true);

  /*useEffect(() => {
    API.getHikes() API che prende tutte le hikes
      .then((hikesList) => { setHikesList(hikesList); setFlag1(false); })
      .catch(err => console.log(err))
  }, [flag1]);*/

  /*const doLogIn = (credentials) => {

    API.logIn(credentials) API che fa il login (credentials=email)
      .then(user => {

        setLoggedIn(true);
        setUser(user);
        setFlag1(true);
      })
      .catch(err => {
      }
      )
  }*/

  //deve esserci una funzione di register doRegistration


  /*const doLogOut = async () => {
    if (loggedIn) {
      await API.logOut(); API che fa il logout
    }
    setLoggedIn(false);
    setUser({});
  }*/


  return (
    <>
      <UserContextWrapper>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Layout />} >
              <Route path='hikes' element={<HikesSearchPage />} />
              <Route path='' element={<Landing />} />
              <Route path='/hike/:id' element={<></>}/>
              <Route path='/hike/edit/:id' element={<></>}/>
              <Route path='/hike/edit/' element={<></>}/>

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
