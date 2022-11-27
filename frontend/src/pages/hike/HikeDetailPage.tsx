import { Center, Container, Loader, Paper, Title, Text, Divider, Space, Blockquote, Group, Stack, Box, Button } from '@mantine/core';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import s from './HikeDetailPage.module.css';
import { MapContainer, TileLayer, useMap, Polyline } from 'react-leaflet'
// import * as defaultTrack from './rocciamelone.json'
import { UserContext } from '../../context/userContext';
import { useInterval } from '@mantine/hooks';
import { API } from '../../utilities/api/api';
import { Hike } from '../../generated/prisma-client';



const HikeDetailPage: React.FC = () => {

  const [hike, setHike] = useState<Hike | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [track, setTrack] = useState<[number, number][] | undefined>(undefined)
  const [center, setCenter] = useState<[number, number] | undefined>([41.8, 12.4])
  const [offset, setOffset] = useState(0)
  const { id } = useParams()

  const { start } = useInterval(() => {
    setOffset((o) => o - 1)
  }, 16 * 2)



  const { state, setState } = useContext(UserContext)
  const { loggedIn } = state

  const navigate = useNavigate()


  const fetchHike = async (id: string) => {
    return await API.hike.getHike(parseInt(id))
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
        if (!hike) return
        setHike(hike)
        if (hike.GpsTrack) {
          console.log("Download track")
          const xml = await axios.get(`http://localhost:3001/` + hike.GpsTrack, { withCredentials: true })
          console.log("Extract track")
          const points = extrackPoints(xml.data)
          console.log("Set points")
          setTrack(points)
          setCenter(points[0])
          start()
        }
      } catch (error) {
        setError("There was an error fetching a hike")
      }
      setLoading(false)
    }
    run()

  }, [id])

  if (loading) {
    return <Center><Loader size={'xl'} mx={'auto'} /></Center>
  }

  return (
    <>
      <Container>
        <Paper p={'md'} radius={'md'} shadow={'md'} withBorder>
          <Group position='apart'>
            <Title order={1}>{hike?.Title}</Title>
            {loggedIn && state.data?.type == 'guide' && <Button onClick={() => navigate(`/hike/edit/${id}`)}>Edit Hike</Button>}
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
          { }
          <MapContainer center={center} zoom={12} className={s.map} style={{
            // height: '300px',
          }} >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polyline pathOptions={{ dashArray: '10', dashOffset: offset.toString() }} positions={track || []} />
            <MapSetter center={center} />

          </MapContainer>
        </Box>
      </Container>
    </>
  );
};

export default HikeDetailPage;

function extrackPoints(data: any): [number, number][] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data, "text/xml");
  const points = xmlDoc.getElementsByTagName("trkpt")
  const pointsArray = Array.from(points)
  const pointsCoordinates = pointsArray.map((point) => {
    return [parseFloat(point.getAttribute('lat') || ''), parseFloat(point.getAttribute('lon') || '')] as [number, number]
  })
  return pointsCoordinates
}

const MapSetter = ({ center }: { center: [number, number] | undefined }) => {

  const map = useMap()

  useEffect(() => {
    // setTimeout(() => {
    if (center)
      map.flyTo(center, 13)
    // }, 1000)
  }, [center])

  return (
    <></>
  )
}
