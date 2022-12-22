import s from './HutsSearchPage.module.css';
import { Box, Button, Center, Container, CSSObject, LoadingOverlay, Pagination, Paper, Space, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form'
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import HutsList from '../../components/hutsList/HutsList';
import { Hut, Point } from '../../generated/prisma-client/index';
import ErrorModal from '../../components/errorModal/errorModal';

const elementsPerPage = 5;

const HutsSearchPage: React.FC = () => {
  const [params, setParams] = useSearchParams()
  const [error, setError] = useState('')
  const [result, setResult] = useState<(Point & { Hut: Hut })[]>([])
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
    try{
    setLoading(true)
    console.log(values)
    setParams({
      region: values.region || '',
      province: values.province || '',
    })
    const res = await axios.get('http://localhost:3001/api/point', {
      params: {
        region: values.region || undefined,
        province: values.province || undefined,
        Hut: true,
      },
      withCredentials: true
    })

    setResult(res.data)
    setLoading(false)
  } catch (e: any) {
    setLoading(false)
    setError(e.message)
  }
}
  return (
    <>
    <div style={{ width: 400, position: 'relative' }}>
        <LoadingOverlay visible={loading} overlayBlur={2} />
      </div>
    <ErrorModal error={error} setError={setError} />
    <Container size="lg">
      <Title >Search a Hut</Title>
      <Box sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start"
        } as CSSObject}>
        <Paper withBorder shadow={'md'} p={'md'} m={'md'} radius={'md'} sx={{
              flexGrow: 1,
              flexShrink: 0,
            } as CSSObject
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
        <Paper withBorder radius={'md'} m={'md'} p={'md'} sx={{
              flexGrow: 3,
              flexBasis: '60%',
              overflow: 'hidden'
            } as CSSObject
        }>
          {<HutsList data={result.slice((page - 1) * elementsPerPage, elementsPerPage * page)}></HutsList >}
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
    </>
  );
};


export default HutsSearchPage;
