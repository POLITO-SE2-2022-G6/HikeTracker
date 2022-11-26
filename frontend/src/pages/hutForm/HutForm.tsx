import s from './HutForm.module.css';
import { useForm } from '@mantine/form'
import axios from 'axios';
import { Button, Container, Paper, TextInput, Title, NumberInput, FileInput, Group, Textarea } from '@mantine/core';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
//import { IconUpload } from '@tabler/icons';
//import { useParams } from 'react-router-dom';

const HutForm: React.FC = () => {

  const navigate = useNavigate();
  const [error, setError] = useState('');


  type Fields = {
    title?: string;
    length?: number;
    expected_time?: number;
    ascent?: number;
    difficulty?: number;
    // start_point?: number;
    // end_point?: number;
    description?: string;
    gpstrack?: File;
  }

  const form = useForm<Fields>({
    initialValues: {
      title: '',
      length: undefined,
      expected_time: undefined,
      ascent: undefined,
      difficulty: undefined,
      // start_point: undefined,
      // end_point: undefined,
      description: '',
      gpstrack: undefined,
    },

    validate: {
      title: (value: string) => (!value ? 'Title must not be empty' : null),
      length: (value: number) => (!value ? 'Length must not be empty' : null),
      expected_time: (value: number) => (!value ? 'Expected time must not be empty' : null),
      ascent: (value: number) => (!value ? 'Ascent must not be empty' : null),
      difficulty: (value: number) => (!value ? 'Difficulty must not be empty' : null),
      description: (value: string) => (!value ? 'Description must not be empty' : null),
    },
  });

  const handleSubmit = async (values: Fields) => {
    
    addHut(values)

  }

  const addHut = async (values: Fields) => {
    try {
      console.log(values);
      /*const res = await axios.post('http://localhost:3001/hut', values, QUI AGGIUNGI NUOVO HUT
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })*/
         navigate('/');

    } catch (err) {
      setError('Error - creating a new hut');
    }
  }

  return (
    <Container>
      <Title align="center">Add a new Hut</Title>
      <Container sx={(t) => {
        return {
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start"
        }
      }}>
        <Paper withBorder shadow={'md'} p={'md'} m={'md'} radius={'md'} sx={
          (t) => {
            return {
              flexGrow: 1,
              flexShrink: 0,
            }
          }
        }>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Title"
              placeholder="Title of the hike"
              {...form.getInputProps('title')} />
            <Textarea
              label="Description"
              placeholder="Description of the hike"
              {...form.getInputProps('description')} />
            <NumberInput
              label="Length"
              description="In kilometers"
              precision={1}
              step={0.5}
              placeholder="2"
              min={1}
              {...form.getInputProps('length')} />
            <NumberInput
              label="Expected Time"
              placeholder="10"
              min={1}
              {...form.getInputProps('expected_time')} />
            <NumberInput
              label="Ascent"
              description="In meters"
              precision={1}
              step={0.5}
              placeholder="Ascent of the hike"
              {...form.getInputProps('ascent')}
            />
            <NumberInput
              label="Difficulty"
              placeholder="0"
              min={0}
              max={4}
              {...form.getInputProps('difficulty')} />
            <Group position="center">
              <Button mt="xl" type='submit'>Add Hut</Button>
              <Link to="/">
                <Button mt="xl" color="red">Cancel</Button>
              </Link>
            </Group>
          </form>
        </Paper>
      </Container>
    </Container>
  )
}

export default HutForm;