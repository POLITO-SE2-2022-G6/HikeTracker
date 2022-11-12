import {
  TextInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import s from './Login.module.css';

const Login: React.FC = (props) => {

  const navigate = useNavigate();
  const { state, setState } = useContext(UserContext)

  const form = useForm({
    initialValues: { email: '' },

    // functions will be used to validate values at corresponding key
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },

  });


  const handleSubmit = async (values: any) => {

    const res = await axios.post('http://localhost:3001/api/sessions', {
      email: values.email,
      password: 'password'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
    if (res.status === 200) {
      setState({ loggedIn: true, data: res.data })
      navigate('/');
    }



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
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <TextInput mt="sm" label="Email" placeholder="Email" {...form.getInputProps('email')} required />
          <Button fullWidth mt="xl" type="submit" >Sign in</Button>
        </form>
        <Button fullWidth mt="xl" type="submit" onClick={() => navigate('/')}>Proceed as a visitor</Button>
      </Paper>
    </Container>
  );
};

export default Login;
