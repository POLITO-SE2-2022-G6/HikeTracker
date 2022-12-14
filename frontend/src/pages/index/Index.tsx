import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from '../../components/layout/Layout';
import Login from '../login/Login';
import Register from '../register/Register';
import HikeDetailPage from '../hike/HikeDetailPage';
import ActivityPage from '../hike/ActivityPage';
import HikesSearchPage from '../hikes/HikesSearchPage';
import HikeForm from '../hikeForm/HikeForm';
import HikerPage from '../userarea/hikerPage/HikerPage';
import GuidePage from '../userarea/guidePage/GuidePage';
import PerformanceForm from '../userarea/hikerPage/PerformanceForm';
import HutsSearchPage from '../huts/HutsSearchPage';
import HutForm from '../hutForm/HutForm';
import ParkingLotForm from '../parkingLotForm/ParkingLotForm';
import Home from '../home/Home';
import { UserContext, UserContextWrapper } from '../../context/userContext';
import { useContext } from 'react';
import { Landing } from '../landing/Landing';

const Index: React.FC = () => {

  const { state } = useContext(UserContext);

  const { loggedIn } = state;

  return (
    <>
      <UserContextWrapper>
        <BrowserRouter>
          <Routes>
            <Route path='' element={<Home />} />
            <Route path='/' element={<Layout />} >
              <Route path='hikes' element={<HikesSearchPage />} />
              <Route path='/hikelist' element={<Landing />} />
              <Route path='/hike/:id' element={<HikeDetailPage />} />
              <Route path='/hike/edit/' element={<HikeForm />} />
              <Route path='/hike/edit/:id' element={<HikeForm />} />
              <Route path='/hikestarted/:id' element={<ActivityPage />} />
              <Route path='/guidearea' element={<GuidePage />} />
              <Route path='/hikerarea' element={<HikerPage />} />
              <Route path='/performances' element={<PerformanceForm />} />
              <Route path='/hut/edit/' element={<HutForm />} />
              <Route path='huts' element={<HutsSearchPage />} />
              <Route path='/parkinglot/edit/' element={<ParkingLotForm />} />
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

