import {
  TextInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Box,
  Flex,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { CSSObject, useMantineTheme } from '@mantine/styles';
import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { API } from '../../utilities/api/api';

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
    const res = await API.auth.login({
      email: values.email,
      password: 'password'
    })
    if (res) {
      setState({ loggedIn: true, data: res })
      navigate('/hikelist');
    }



  }

  return (
    <Container size={420} h="100vh">
      <Flex justify='center' align='center' h={'100%'} >
        <Box w="400px">

          <Title align="center" sx={{ fontFamily: `Greycliff CF, ${useMantineTheme}`, fontWeight: 900 } as CSSObject}>
            Welcome back!
          </Title>
          <Text color="dimmed" size="sm" align="center" mt={5}>
            Do not have an account yet?{' '}
            <Anchor<'a'> href="#" size="sm" onClick={useCallback(() => { navigate("/register") }, [navigate])}> Create account</Anchor>
          </Text>
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
              <TextInput mt="sm" label="Email" placeholder="Email" {...form.getInputProps('email')} required />
              <Button fullWidth mt="xl" type="submit" >Sign in</Button>
            </form>
            <Button fullWidth mt="xl" type="submit" onClick={useCallback(() => navigate('/hikelist'), [navigate])}>Proceed as a visitor</Button>
          </Paper>
        </Box>
      </Flex>
    </Container>

  );
};

export default Login;
