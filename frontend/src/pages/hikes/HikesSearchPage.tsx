import s from './HikesSearchPage.module.css';
import { Box, Button, Center, Container, Pagination, Paper, Space, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form'
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import HikesList from '../../components/hikesList/HikesList';
import { HikeCardGrid } from '../../components/hikeCardGrid/hikeCardGrid';
import { Hike } from '../../generated/prisma-client/index';

const elementsPerPage = 5;

const HikesSearchPage: React.FC = () => {
  const [params, setParams] = useSearchParams()
  const [result, setResult] = useState<Hike[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  type Fields = {
    region?: string;
    province?: string;
    difficulty?: number;
    length?: number;
    expected_time?: number;
  }
  const form = useForm<Fields>({
    initialValues: {
      region: params.get('region') || '',
      province: params.get('province') || '',
      difficulty: parseInt(params.get('difficulty') || '') || undefined,
      length: parseInt(params.get('length') || '') || undefined,
      expected_time: parseInt(params.get('duration') || '') || undefined,
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
      duration: values.expected_time?.toString() || '',
    })



    const res = await axios.get('http://localhost:3001/hike', {
      params: {
        difficulty: values.difficulty || undefined,
        length: values.length || undefined,
        expected_time: values.expected_time || undefined,
        region: values.region || undefined,
        province: values.province || undefined
      }
    })
    setLoading(false)

    setResult(res.data)
    console.log(res.data)
  }
  return (
    <Container size="lg">
      <Title >Search a Hike</Title>
      <Box sx={(t) => {
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
              name="expected_time"
              {...form.getInputProps('expected_time')}
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
          {/* <HikesList data={result}></HikesList > */}
          <HikeCardGrid hikes={result.slice((page - 1) * elementsPerPage, elementsPerPage * page)} />
          <Center>
            <Pagination
              total={result.length / elementsPerPage + (result.length % elementsPerPage ? 1 : 0)}
              page={page}
              onChange={setPage}
            />
          </Center>
        </Paper>
      </Box >
    </Container >
  );
};

export default HikesSearchPage;
