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
import { useNavigate } from 'react-router-dom';
import s from './Login.module.css';

const Login: React.FC = (props) => {

  const navigate = useNavigate();

  const form = useForm({
    initialValues: { email: '' },

    // functions will be used to validate values at corresponding key
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },

  });


  const handleSubmit = (values: any) => {

    console.log(values.email);
    //props.login(values.email) 

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
