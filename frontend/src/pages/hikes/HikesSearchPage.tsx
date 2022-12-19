import s from './HikesSearchPage.module.css';
import { Box, Button, Center, Container, Pagination, Paper, Slider, Space, TextInput, Title, Text, CSSObject } from '@mantine/core';
import { useForm } from '@mantine/form'
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { HikeCardGrid } from '../../components/hikeCardGrid/hikeCardGrid';
import { Hike } from '../../generated/prisma-client/index';
import { formatDifficulty, formatLength, formatTime } from '../../utilities/formatters';

const elementsPerPage = 6;

const HikesSearchPage: React.FC = () => {
  const [params, setParams] = useSearchParams()
  const [result, setResult] = useState<Hike[]>([])
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
      difficulty: parseInt(params.get('difficulty') || '1') || undefined,
      length: parseInt(params.get('length') || '1') || undefined,
      expected_time: parseInt(params.get('duration') || '') || undefined,
    },
  })

  const handleSubmit = async (values: Fields) => {
    console.log(values)
    let len = 0
    if (values.length && values.length < 1000) {
      len = values.length * 1000
    }
    setParams({
      region: values.region || '',
      province: values.province || '',
      difficulty: values.difficulty?.toString() || '',
      length: values.length?.toString() || '',
      duration: values.expected_time?.toString() || '',
    })



    const res = await axios.get('http://localhost:3001/api/hike', {
      params: {
        difficulty: values.difficulty || undefined,
        length: len || undefined,
        expected_time: values.expected_time || undefined,
        region: values.region || undefined,
        province: values.province || undefined
      }
    })

    setResult(res.data)
    console.log(res.data)
  }
  return (
    <Container size="lg">
      <Title >Search a Hike</Title>
      <Box sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start"
        } as CSSObject}>
        <Paper withBorder shadow={'md'} p={'md'} m={'md'} radius={'md'} sx={{
              flexGrow: 1,
              flexShrink: 0,
            } as CSSObject}>
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
            <Text fw={500} fz='sm'>
              Difficulty:&nbsp;
              {form.values.difficulty && formatDifficulty(form.values.difficulty)}
            </Text>
            <Slider
              py={'md'}
              min={1}
              max={5}
              step={1}
              name="difficulty"
              label={formatDifficulty}
              marks={[
                { value: 1 },
                { value: 2 },
                { value: 3 },
                { value: 4 },
                { value: 5 }
              ]}
              {...form.getInputProps('difficulty')}

            />
            <Text fw={500} fz='sm'>
              Length:&nbsp;
              {form.values.length && formatLength(calcScale(form.values.length))}
            </Text>
            <Slider
              scale={calcScale}
              py={'md'}
              min={1}
              max={1000}
              label={formatLength}
              name="length"
              defaultValue={10}
              {...form.getInputProps('length')}

            />
            {/* <TextInput
              label="Duration"
              placeholder="2"
              name="expected_time"
              {...form.getInputProps('expected_time')}
            /> */}
            <Text fw={500} fz='sm'>
              Duration:&nbsp;
              {form.values.expected_time && formatTime(form.values.expected_time)}
            </Text>
            <Slider
              py={'md'}
              min={1}
              max={24 * 60}
              step={30}
              label={formatTime}
              {...form.getInputProps('expected_time')}
            />
            <Space h={'md'} />
            <Button fullWidth type='submit'>Cerca</Button>
          </form>
        </Paper>
        <Paper withBorder radius={'md'} m={'md'} p={'md'} sx={{
              flexGrow: 3,
              flexBasis: '60%',
              overflow: 'hidden'
            } as CSSObject}>
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


function calcScale(value: number) {
  return 0.000001 * (value ** 3);
}



export default HikesSearchPage;
