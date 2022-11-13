import { Button, Container } from "@mantine/core";
import { Link } from "react-router-dom";
import HikesList from "../../components/hikesList/HikesList";
import { UserContext } from '../../context/userContext';
import { useContext } from 'react';

export const Landing = () => {
  const { state, setState } = useContext(UserContext)
  
  return (
    <Container>
      <h1>LANDING PAGE</h1>

      <Link to="hikes">
        <Button> Search Hikes</Button>
      </Link>
      <HikesList/>
      { (state.data?.type === 'guide') ? <NewHikeButton/> : ''}
    </Container>
  );
};

function NewHikeButton() {
  return (
    <Link to="/hike/edit">
    <Button mt="sm"> Add New Hike</Button>
  </Link>
  );
}
