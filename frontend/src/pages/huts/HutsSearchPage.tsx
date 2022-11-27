import s from './HutsSearchPage.module.css';
import { Box, Button, Center, Container, Pagination, Paper, Space, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form'
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import HutsList from '../../components/hutsList/HutsList';
import { HikeCardGrid } from '../../components/hikeCardGrid/hikeCardGrid';
import { Hut } from '../../generated/prisma-client/index';

const elementsPerPage = 5;

const HutsSearchPage: React.FC = () => {
  const [params, setParams] = useSearchParams()
  const [result, setResult] = useState<Hut[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  type Fields = {
    region?: string;
    province?: string;
  }
  const form = useForm<Fields>({
    initialValues: {
      region: params.get('region') || '',
      province: params.get('province') || '',
    },
  })

  const handleSubmit = async (values: Fields) => {
    setLoading(true)
    console.log(values)
    setParams({
      region: values.region || '',
      province: values.province || '',
    })



    const res = await axios.get('http://localhost:3001/api/hut', {
      params: {
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
      <Title >Search a Hut</Title>
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
            <Space h={'md'} />
            <Button fullWidth type='submit'>Find</Button>
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
          { <HutsList data={result}></HutsList > }
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

export default HutsSearchPage;