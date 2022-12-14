import { Container, Paper, Title, Text, Space, Blockquote, Group, Stack, Box, Button, LoadingOverlay } from '@mantine/core';
import axios from 'axios';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import s from './HikeDetailPage.module.css';
import { MapContainer, TileLayer, useMap, Polyline, Marker, Popup } from 'react-leaflet'
import { UserContext } from '../../context/userContext';
import { useInterval } from '@mantine/hooks';
import { API } from '../../utilities/api/api';
import { Hike as HIKE, Hut, Point } from '../../generated/prisma-client';
import { extrackPoints } from '../../utilities/gpx';
import { withPoint } from '../../utilities/api/hikeApi';
import ErrorModal from '../../components/errorModal/errorModal';

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
  const [error, setError] = useState<string>('')
  const [track, setTrack] = useState<[number, number][] | undefined>(undefined)
  const [center, setCenter] = useState<[number, number]>([41.8, 12.4])
  const [offset, setOffset] = useState(0)
  const { id } = useParams()

  const { start } = useInterval(() => {
    setOffset((o) => o - 1)
  }, 16 * 2)



  const { state } = useContext(UserContext)
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
      } catch (error: any) {
        setError(error.message)
      }
      setLoading(false)
    }
    if (loading) run()

  }, [id, start, loading])


  return (
    <>
      <div style={{ width: 400, position: 'relative' }}>
        <LoadingOverlay visible={loading} overlayBlur={2} />
      </div>
      <ErrorModal error={error} setError={setError} />
      <Container>
        <Space h={'md'} />

        <Paper p={'md'} radius={'md'} shadow={'md'} withBorder>
          <Group position='apart'>
            <Title order={1}>{hike?.title}</Title>
            <Button type="button" style={{ visibility: (loggedIn && state.data?.type === 'guide' && state.data?.id === hike?.localguideid) ? 'visible' : 'hidden' }} onClick={useCallback(() => { navigate(`/hike/edit/${id}`) }, [id, navigate])}>Edit Hike</Button>
            <Button type="button" style={{ visibility: (loggedIn && state.data?.type === 'hiker') ? 'visible' : 'hidden' }}
              onClick={useCallback(async () => {
                if (!(id && hike && hike.startpointid)) return

                try {
                  const activity = await API.hiker.startActivity(id, hike.startpointid)
                  if (!activity) return
                  navigate(`/hikestarted/${activity.id}`)
                } catch (error: any) {
                  console.log(JSON.stringify(error, Object.getOwnPropertyNames(error)))
                  // In error there is no response body for the reason why the request failed
                  setError(error.message)
                }
              }, [id, hike, navigate])}>Start Activity</Button>
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
                useMemo(() => {
                  return [hike?.start_point && PointMarker(hike.start_point),
                  hike?.end_point && PointMarker(hike.end_point)]
                }, [hike?.start_point, hike?.end_point])
              }
              {useMemo(() => <DisplayReferencePoints points={hike?.reference_points || []} />, [hike?.reference_points])}
              {useMemo(() => <DisplayHuts huts={hike?.huts || []} />, [hike?.huts])}
            </MapContainer>
          </Box>
        </Paper>
        <Space h={'md'} />
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

function PointMarker(point: Point) {
  if (!point.latitude || !point.longitude) return null
  return <Marker key={point.id}
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
  }, [center, map])

  return (
    <></>
  )
}
