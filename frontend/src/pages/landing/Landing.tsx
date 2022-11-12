import { Button, Container } from "@mantine/core";
import { Link } from "react-router-dom";
import HikesList from "../../components/hikesList/HikesList";

export const Landing = () => {
  return (
    <Container>
      <h1>LANDING PAGE</h1>

      <Link to="hikes">
        <Button> Search Hikes</Button>
      </Link>
      <HikesList/>
    </Container>
  );
};
