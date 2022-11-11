import { createStyles, Header, Container, Button, Title, Footer } from '@mantine/core';
import { GiHiking } from "react-icons/gi"
import { BiLogInCircle, BiLogOutCircle } from "react-icons/bi"
import { BsPersonCircle } from "react-icons/bs"
import { Link, Outlet, useNavigate } from 'react-router-dom';
import s from './layout.module.css';
import React from 'react';


const Layout = () => {

  const { classes } = useStyles();
  const navigate = useNavigate();

  let loggedIn: boolean = false; //provvisory

  return (
    <>
      <Header height={56} className={classes.header} mb={20}>
        <Container>
          <div className={classes.inner}>
            <Link to={'/'}>
              <Title order={4} color="white" >Hike Tracks <GiHiking size="20px"></GiHiking> - Group 6, SE II</Title>
            </Link>
            <div>
              {loggedIn ?
                <Button onClick={() => { }}>LOG-OUT <BiLogOutCircle size="20px" /></Button> :
                <Button onClick={() => { navigate("/login"); }}>LOG-IN <BiLogInCircle size="20px" /></Button>
              }
              <Button type="button" className="btn btn-primary" onClick={() => { }}>USER AREA <BsPersonCircle color='white' size='20px' /></Button>
            </div>
          </div>
        </Container>
      </Header>
      <Outlet />
    </>
  );
};

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,
    borderBottom: 0,
  },

  /*footer: {
    backgroundColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,
  },*/

  inner: {
    height: 56,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

}));

export default Layout;
