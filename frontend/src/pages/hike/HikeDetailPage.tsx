import { Center, Container, Loader, Paper, Title, Text, Space, Blockquote, Group, Stack, Box, Button } from '@mantine/core';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import s from './HikeDetailPage.module.css';
import { MapContainer, TileLayer, useMap, Polyline, Marker, Popup } from 'react-leaflet'
// import * as defaultTrack from './rocciamelone.json'
import { UserContext } from '../../context/userContext';
import { useInterval } from '@mantine/hooks';
import { API } from '../../utilities/api/api';
import { Hike as HIKE, Hut, Point } from '../../generated/prisma-client';
import { extrackPoints } from '../../utilities/gpx';
import { withPoint } from '../../utilities/api/hikeApi';

type Hike = HIKE & {
  start_point: Point,
  end_point: Point,
  huts: (Hut & {
    point: Point
  })[],
  reference_points: Point[]
}

const HikeDetailPage: React.FC = () => {

  const [hike, setHike] = useState<Hike | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [track, setTrack] = useState<[number, number][] | undefined>(undefined)
  const [center, setCenter] = useState<[number, number]>([41.8, 12.4])
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
        if (hike.gpstrack) {
          console.log("Download track")
          const xml = await axios.get(`http://localhost:3001/` + hike.gpstrack, { withCredentials: true })
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
            <Title order={1}>{hike?.title}</Title>
            {loggedIn && state.data?.type == 'guide' && <Button onClick={() => navigate(`/hike/edit/${id}`)}>Edit Hike</Button>}
          </Group>
          <Space h={'md'} />

          <Stack maw='15em'>
            <Group position='apart' >
              <Text>Length:</Text>
              <Text>{((hike?.length || 0) / 1000).toPrecision(2)} km</Text>
            </Group>
            <Group position='apart' >
              <Text>Expected Time:</Text>
              <Text>{hike?.expected_time} min</Text>
            </Group>
            <Group position='apart' >
              <Text>Ascent:</Text>
              <Text>{hike?.ascent} m</Text>
            </Group>
            <Group position='apart' >
              <Text>Difficulty:</Text>
              <Text>{hike?.difficulty}</Text>
            </Group>

          </Stack>

          <Title order={4}>What our local guides have to say:</Title>
          <Blockquote maw={'60%'}>{hike?.description}</Blockquote>
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
            {
              [hike?.start_point && PointMarker(hike.start_point),
              hike?.end_point && PointMarker(hike.end_point)]
            }
            <DisplayReferencePoints points={hike?.reference_points || []} />
            <DisplayHuts huts={hike?.huts || []} />
          </MapContainer>
        </Box>
      </Container>
    </>
  );
};

function DisplayReferencePoints({ points }: { points: Point[] }) {
  return <>{points.map((p) => PointMarker(p))}</>
}

function DisplayHuts({ huts }: { huts: withPoint<Hut>[] }) {
  return <>{huts.map((h) => PointMarker(h.point))}</>
}

export default HikeDetailPage;

function DisplayReferencePoints(points: Point[]) {
  points.forEach((point) => {
    return <Marker
      position={[point.latitude!, point.longitude!]}
    // icon={hutIcon}
    >
      <Popup>
        {point.label}
      </Popup>
    </Marker>
  })
}

function PointMarker(point: Point) {
  if (!point.latitude || !point.longitude) return null
  return <Marker
    position={[point.latitude, point.longitude]}
  >
    <Popup>
      {point.label}
    </Popup>
  </Marker>;
}


export const MapSetter = ({ center }: { center: [number, number] | undefined }) => {

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
