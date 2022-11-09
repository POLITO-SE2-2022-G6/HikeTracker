import { createStyles, Header, Container, Button, Title } from '@mantine/core';
import { GiHiking } from "react-icons/gi"
import { BiLogInCircle, BiLogOutCircle } from "react-icons/bi"
import { BsPersonCircle } from "react-icons/bs"
import s from './layout.module.css';
const Layout: React.FC = (props) => {
  const { classes } = useStyles();

  let loggedIn: boolean = false; //provvisory

  return (
    <>
      <Header height={56} className={classes.header} mb={120}>
        <Container>
          <div className={classes.inner}>
            <Title order={4} color="white">Hike Tracks <GiHiking size="20px"></GiHiking> - Group 6, SE II</Title>
            <div>
            {loggedIn ?
              <Button onClick={() => { }}>LOG-OUT <BiLogOutCircle size="20px" /></Button> :
              <Button onClick={() => { }}>LOG-IN <BiLogInCircle size="20px" /></Button>
            }
              <Button type="button" className="btn btn-primary" onClick={() => { }}>Area Utente <BsPersonCircle color='white' size='20px' /></Button>
            </div>
          </div>
        </Container>
      </Header>
    </>
  );
};

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,
    borderBottom: 0,
  },

  inner: {
    height: 56,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

}));

export default Layout;
