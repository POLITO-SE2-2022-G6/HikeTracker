import { Button, Container } from "@mantine/core";
import { Link } from "react-router-dom";
import HikesList from "../../components/hikesList/HikesList";
import { UserContext } from '../../context/userContext';
import { useContext } from 'react';
import s from './Landing.module.css'

export const Landing = () => {
  const { state, setState } = useContext(UserContext)

  return (
    <div className={s.main}>

      <Container >
        <h1>Welcome to HikeTracker, {(state.loggedIn? <>{state.data?.username}!</>: <> visitor!</> )}</h1>

        <Link to="hikes">
          <Button> Search Hikes</Button>
        </Link>
        <HikesList />
        {(state.data?.type === 'Guide') ? <NewHikeButton /> : ''}
      </Container>
    </div>
  );
};

function NewHikeButton() {
  return (
    <Link to="/hike/edit">
      <Button mt="sm"> Add New Hike</Button>
    </Link>
  );
}
