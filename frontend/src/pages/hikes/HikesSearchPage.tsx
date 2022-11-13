import s from './HikesSearchPage.module.css';
import { Box, Button, Container, Paper, Space, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form'
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import HikesList from '../../components/hikesList/HikesList';

const HikesSearchPage: React.FC = () => {
  const [params, setParams] = useSearchParams()
  const [result, setResult] = useState([])
  const [loading, setLoading] = useState(false)

  type Fields = {
    region?: string;
    province?: string;
    difficulty?: number;
    length?: number;
    duration?: number;
  }
  const form = useForm<Fields>({
    initialValues: {
      region: params.get('region') || '',
      province: params.get('province') || '',
      difficulty: parseInt(params.get('difficulty') || '') || undefined,
      length: parseInt(params.get('length') || '') || undefined,
      duration: parseInt(params.get('duration') || '') || undefined,
    },
  })

  const handleSubmit = async (values: Fields) => {
    setLoading(true)
    console.log(values)
    setParams({
      region: values.region || '',
      province: values.province || '',
      difficulty: values.difficulty?.toString() || '',
      length: values.length?.toString() || '',
      duration: values.duration?.toString() || '',
    })



    const res = await axios.get('http://localhost:3001/hike', {
      params: {
        ...values,
        region: values.region || undefined,
        province: values.province || undefined
      }
    })
    setLoading(false)

    setResult(res.data)
    console.log(res.data)
  }
  return (
    <Container>
      <Title >Search a Hike</Title>
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
          <form onSubmit={form.onSubmit(handleSubmit)} className={s.form}>
            <TextInput
              label="Region"
              placeholder="Piemonte"
              name="region"
              {...form.getInputProps('region')}
            />
            <TextInput
              label="Province"
              placeholder="Torino"
              name="province"
              {...form.getInputProps('province')}
            />
            <TextInput
              label="Difficulty"
              placeholder="Easy"
              name="difficulty"
              {...form.getInputProps('difficulty')}
            />
            <TextInput
              label="Length"
              placeholder="10"
              name="length"
              {...form.getInputProps('length')}
            />
            <TextInput
              label="Duration"
              placeholder="2"
              name="duration"
              {...form.getInputProps('duration')}
            />
            <Space h={'md'} />
            <Button fullWidth type='submit'>Cerca</Button>
          </form>
        </Paper>
        <Paper withBorder radius={'md'} m={'md'} p={'md'} sx={
          (t) => {
            return {
              flexGrow: 3,
              flexBasis: '60%',
              overflow: 'hidden'
            }
          }
        }>
          <HikesList data={result}></HikesList >

        </Paper>
      </Container >
    </Container>
  );
};

export default HikesSearchPage;
