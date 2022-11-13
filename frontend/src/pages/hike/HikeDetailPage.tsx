import { Center, Container, Loader, Paper, Title, Text, Divider, Space, Blockquote, Group, Stack, Box, Button } from '@mantine/core';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import s from './HikeDetailPage.module.css';
import { MapContainer, TileLayer, useMap, Polyline } from 'react-leaflet'
import * as track from './rocciamelone.json'
import { UserContext } from '../../context/userContext';



const HikeDetailPage: React.FC = () => {

  type Hike = {
    Title: string;
    Length: number;
    Expected_time: number;
    Ascent: number;
    Difficulty: number;
    // start_point: Point;
    // end_point: Point;
    // reference_points: Point[];
    Description: string;
    GpsTrack?: string | undefined;
  }
  const [hike, setHike] = useState<Hike | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { id } = useParams()

  const {state, setState} = useContext(UserContext)
  const {loggedIn} = state

  const navigate = useNavigate()
  

  const fetchHike = async (id: string) => {
    const res = await axios.get(`http://localhost:3001/hike/${id}`, { withCredentials: true })
    return res.data
  }

  useEffect(() => {
    if (!id) {
      setError('Invalid Hike')
      setLoading(false)
      return
    }
    const run = async () => {
      try {
        const hike = await fetchHike(id)
        setHike(hike)
      } catch (error) {
        setError("There was an error fetching a hike")
      }
      setLoading(false)
    }
    run()

  }, [id])
  return (
    <>
      <Container>
        {loading && <Center><Loader size={'xl'} mx={'auto'} /></Center>
        }

        <Paper p={'md'} radius={'md'} shadow={'md'} withBorder>
          <Group position='apart'>
            <Title order={1}>{hike?.Title}</Title>
            {loggedIn && state.data?.type == 'Guide' && <Button onClick={() => navigate(`/hike/edit/${id}`)}>Edit Hike</Button>}
          </Group>
          <Space h={'md'} />

          <Stack maw='15em'>
            <Group position='apart' >
              <Text>Length:</Text>
              <Text>{((hike?.Length || 0) / 1000).toPrecision(2)} km</Text>
            </Group>
            <Group position='apart' >
              <Text>Expected Time:</Text>
              <Text>{hike?.Expected_time} min</Text>
            </Group>
            <Group position='apart' >
              <Text>Ascent:</Text>
              <Text>{hike?.Ascent} m</Text>
            </Group>
            <Group position='apart' >
              <Text>Difficulty:</Text>
              <Text>{hike?.Difficulty}</Text>
            </Group>

          </Stack>

          <Title order={4}>What our local guides have to say:</Title>
          <Blockquote maw={'60%'}>{hike?.Description}</Blockquote>
        </Paper>

        <Space h={'md'} />
        <Box h={'480px'}>

          <MapContainer center={[45.177786, 7.083372]} zoom={12} className={s.map} style={{
            // height: '300px',
          }} >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polyline pathOptions={{ fillColor: 'red' }} positions={track as [number, number][]} />

          </MapContainer>
        </Box>
      </Container>
    </>
  );
};

export default HikeDetailPage;
