import {
  TextInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import s from './Login.module.css';

/* Regex email format validation */
function isEmailValid(mail: string): boolean {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return (true)
  }
  return (false)
}

const Login: React.FC = (props) => {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);

  const handleSubmit = () => {

    setErrorMsg(false);

    if (!isEmailValid(email)) {
      setErrorMsg(true);
      return;
    }

    console.log(email);
    //props.login(email) 

  }

  return (
    <Container size={420} my={40}>
      <Title align="center" sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}>
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor<'a'> href="#" size="sm" onClick={() => { navigate("/register") }}> Create account</Anchor>
      </Text>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {errorMsg ?
          <TextInput error="Invalid email" onChange={() => setErrorMsg(false)} label="Email" required/> :
          <TextInput value={email} onChange={(event) => setEmail(event.currentTarget.value)} label="Email" placeholder="example@gmail.com" required />}
        <Group position="apart" mt="md"></Group>
        <Button fullWidth mt="xl" type="submit" onClick={() => handleSubmit()}>Sign in</Button>
        <Button fullWidth mt="xl" type="submit" onClick={() => navigate('/')}>Proceed as a visitor</Button>
      </Paper>
    </Container>
  );
};

export default Login;
