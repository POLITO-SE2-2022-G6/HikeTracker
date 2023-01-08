import s from './HutsSearchPage.module.css';
import { Box, Button, Center, Container, CSSObject, LoadingOverlay, Pagination, Paper, Space, TextInput, Title, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form'
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import HutsList from '../../components/hutsList/HutsList';
import ErrorModal from '../../components/errorModal/errorModal';
import { HutWithPoint } from '../../utilities/api/hutApi';
import { Hut, Point } from '../../generated/prisma-client';

const elementsPerPage = 5;

const HutsSearchPage: React.FC = () => {
  const [params, setParams] = useSearchParams()
  const [error, setError] = useState('')
  const [result, setResult] = useState<(HutWithPoint)[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  type Fields = {
    region?: string;
    province?: string;
    description?: string;
    email?: string;
    phone?: string;
    website?: string;
    beds?: number;
    altitude?: number;
  }
  const form = useForm<Fields>({
    initialValues: {
      region: params.get('region') || '',
      province: params.get('province') || '',
      description: params.get('description') || '',
      email: params.get('email') || '',
      phone: params.get('phone') || '',
      website: params.get('website') || '',
      beds: parseInt(params.get('beds') || '') || undefined,
      altitude: parseFloat(params.get('altitude') || '') || undefined,
    },
  })

  const callApi = (values: Fields) => {
    return axios.get<[Point & {hut: Hut}]>('http://localhost:3001/api/point', {
      params: {
        region: values.region || undefined,
        province: values.province || undefined,
        hutdescription: values.description || undefined,
        hutemail: values.email || undefined,
        hutphone: values.phone || undefined,
        hutwebsite: values.website || undefined,
        hutbeds: values.beds || undefined,
        hutaltitude: values.altitude || undefined,
        hut: true,
      },
      withCredentials: true
    })
  }

  const handleSubmit = async (values: Fields) => {
    try {
      setLoading(true)

      setParams({
        region: values.region || '',
        province: values.province || '',
        description: values.description || '',
        email: values.email || '',
        phone: values.phone || '',
        website: values.website || '',
        beds: values.beds?.toString() || '',
        altitude: values.altitude?.toString() || '',
      })

      const res = await callApi(values)
      
      const correct = res.data.map(el => {
        const hut = el.hut
        const point = {...el, hut: undefined}

        return {...hut, point}
      })

      setResult(correct)
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
              <NumberInput
                label="Altitude"
                placeholder="Altitude"
                name="altitude"
                {...form.getInputProps('altitude')}
              />
              <TextInput
                label="Description"
                placeholder="Description"
                name="description"
                {...form.getInputProps('description')}
              />
              <NumberInput
                label="Beds"
                placeholder="Beds"
                name="beds"
                min={0}
                {...form.getInputProps('beds')}
              />
              <TextInput
                label="Phone"
                placeholder="Phone"
                name="phone"
                {...form.getInputProps('phone')}
              />
              <TextInput
                label="Email"
                placeholder="Email"
                name="email"
                {...form.getInputProps('email')}
              />
              <TextInput
                label="Website"
                placeholder="Website"
                name="website"
                {...form.getInputProps('website')}
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
