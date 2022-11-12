import { Button, Container } from "@mantine/core";
import { Link } from "react-router-dom";

export const Landing = () => {
  return (
    <Container>
      <h1>LANDING PAGE</h1>

      <Link to="hikes">
        <Button> Search Hikes</Button>
      </Link>
    </Container>
  );
};
