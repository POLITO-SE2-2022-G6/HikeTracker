import {
  TextInput,
  Select,
  Paper,
  Title,
  Container,
  Button,
  Alert,
  Space,
  CSSObject,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../utilities/api/api';

const Register: React.FC = () => {

  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const form = useForm({
    initialValues: { email: '', type: '', username: '', phoneNumber: '' },

    // functions will be used to validate values at corresponding key
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      type: (value) => (!value ? 'Type must not be empty' : null),
      username: (value) => (value.length < 3 ? 'Username must have at least 2 letters' : null),
      phoneNumber: (value) => (isNaN(Number(value)) ? 'Phone number must be a number' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {

    try {
      await API.auth.register(values);
      navigate('/login');

    } catch (err: any) {
      setError('Something went wrong: ' + err.message);
    }

  }


  return (
    <Container size={420} my={40}>
      <Title align="center" sx={{ fontFamily: `Greycliff CF, ${useMantineTheme}`, fontWeight: 900 } as CSSObject}>
        Create an account!
      </Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput mt="sm" label="Email" placeholder="Email" {...form.getInputProps('email')} required />
          <TextInput label="Username" placeholder="Username" {...form.getInputProps('username')} required />
          <Select
            label="Type"
            placeholder="Pick one"
            data={[
              { value: 'hiker', label: 'Hiker' },
              { value: 'guide', label: 'Guide' },

            ]}
            {...form.getInputProps('type')}
            required
          />
          <TextInput label="Phone number" placeholder="Phone number" {...form.getInputProps('phoneNumber')} required />

          {
            error && <>
              <Space h={'md'}/>
              <Alert title="Errore" color={'red'}>
                {error}
              </Alert>
            </>

          }
          <Button fullWidth mt="xl" type="submit">Register</Button>
        </form>
        <Button fullWidth mt="xl" onClick={useCallback(() => navigate('/hikelist'), [navigate])}>Proceed as a visitor</Button>
      </Paper>
    </Container>
  );
};

export default Register;
