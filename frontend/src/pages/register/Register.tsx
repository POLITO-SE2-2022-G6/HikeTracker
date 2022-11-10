import {
  TextInput,
  Select,
  Paper,
  Title,
  Container,
  Group,
  Button,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import s from './Register.module.css';

/* Regex email format validation */
function isEmailValid(mail: string): boolean {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return (true)
  }
  return (false)
}

const Register: React.FC = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorUsername, setErrorUsername] = useState(false);
  const [errorType, setErrorType] = useState(false);
  const [errorPhoneNumber, setErrorPhoneNumber] = useState(false);

  const handleSubmit = (event: any) => {

    event.preventDefault();
    setErrorEmail(false);
    setErrorUsername(false);
    setErrorType(false);
    setErrorPhoneNumber(false);

    let errors: boolean = false;

    if (!isEmailValid(email)) {
      setErrorEmail(true);
      errors = true;
    }
    if (!errorType) {
      setErrorType(true);
      errors = true;
    }
    if (!errorUsername) {
      setErrorUsername(true);
      errors = true;
    }
    if (!errorPhoneNumber) {
      setErrorPhoneNumber(true);
      errors = true;
    }

    if (errors)
      return;

    //props.login(email) 

  }

  return (
    <Container size={420} my={40}>
      <Title align="center" sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}>
        Create an account!
      </Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {errorEmail ?
          <TextInput error="Invalid email" onChange={() => setErrorEmail(false)} label="Email" required /> :
          <TextInput value={email} onChange={(event) => setEmail(event.currentTarget.value)} label="Email" placeholder="example@gmail.com" required />}

        {errorUsername ?
          <TextInput error="Invalid username" onChange={() => setErrorUsername(false)} label="Username" required /> :
          <TextInput value={username} onChange={(event) => setUsername(event.currentTarget.value)} label="Username" placeholder="example" required />}

        {errorType ?
          <Select error="Invalid Type" onChange={() => setErrorType(false)} label="Type" required
            value={type}
            placeholder="Pick one"
            data={[
              { value: 'Hiker', label: 'Hiker' },
              { value: 'Guide', label: 'Guide' },

            ]}
          /> :
          <Select
            value={type}
            label="Type"
            placeholder="Pick one"
            data={[
              { value: 'Hiker', label: 'Hiker' },
              { value: 'Guide', label: 'Guide' },

            ]}
          />}

        {errorPhoneNumber ?
          <TextInput error="Invalid phone number" onChange={() => setErrorPhoneNumber(false)} label="phoneNumber" required /> :
          <TextInput value={phoneNumber} onChange={(event) => setPhoneNumber(event.currentTarget.value)} label="phoneNumber" placeholder="0123456789" required />}

        <Group position="apart" mt="md"></Group>
        <Button fullWidth mt="xl" type="submit" onClick={handleSubmit}>Register</Button>
        <Button fullWidth mt="xl" type="submit" onClick={() => navigate('/')}>Proceed as a visitor</Button>
      </Paper>
    </Container>
  );
};

export default Register;
