import { Container, Paper, Title, Text, Space, Group, Stack, Box, Button, LoadingOverlay, Flex } from '@mantine/core';
import axios from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import s from './HikeDetailPage.module.css';
import { MapContainer, TileLayer, useMap, Polyline, Marker, Popup } from 'react-leaflet'
import { UserContext } from '../../context/userContext';
import { useInterval } from '@mantine/hooks';
import { API } from '../../utilities/api/api';
import { Hike as HIKE, Hut, Point } from '../../generated/prisma-client';
import { UserHikes } from '../../generated/prisma-client';
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

const ActivityPage: React.FC = () => {

    const [activity, setActivity] = useState<UserHikes | null>(null)

    const [hike, setHike] = useState<Hike | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>('')
    const [track, setTrack] = useState<[number, number][] | undefined>(undefined)
    const [center, setCenter] = useState<[number, number]>([41.8, 12.4])
    const [offset, setOffset] = useState(0)
    const { id } = useParams()
    const { start } = useInterval(() => {setOffset((o) => o - 1)}, 16 * 2)
    const { state } = useContext(UserContext)
    const { loggedIn } = state

    const  [statusHike, setStatusHike] = useState<string>('on going');
    const  [currentCheckPoint, setCurrentCheckPoint] = useState<Point | null>(null);

    const navigate = useNavigate()

    const fetchHike = async (id: string) => {
        let hike= await API.hike.getHike(parseInt(id));
        //fare la fetch di currentCeckPoint e statusHike
        return hike
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
    
    async function handleSubmit() {
        try {
            // update/endActivity API
            navigate('/hikerarea');
        } catch (error: any) {
          setError("Error while updating activity: ");
        }
      }

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
                        <Title order={1}>Hike: {hike?.title}</Title>
                    </Group>
                    <Space h={'md'} />

                    <Flex wrap="wrap">
                        <Box h={'400px'} style={{ flexGrow: 1, minWidth: '400px', }}>
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
                        <Box>
                            <Stack p={'md'}>
                                <ActionsButtons setStatusHike={setStatusHike} setCurrentCheckPoint={setCurrentCheckPoint}/>
                                <Text fw={700}>Current Checkpoint:</Text>
                                <>{currentCheckPoint}</>
                                <Text fw={700}>Current Status Hike:</Text>
                                <>{statusHike}</>
                            </Stack>
                        </Box>
                    </Flex>

                    <Space h={'md'} />
                    <Flex direction={{ base: 'column', sm: 'row' }} gap={{ base: 'sm', sm: 'lg' }} justify={{ sm: 'center' }}>
                        <Button size="md" onClick={useCallback(() => { navigate('/hikerarea') }, [navigate])}>Save</Button>
                        <Button size="md" color="red" onClick={useCallback(() => { navigate('/hikerarea') }, [navigate])}>Go back</Button>
                    </Flex>
                </Paper>
                <Space h={'md'} />

            </Container>
        </>
    );
};

function ActionsButtons({setStatusHike, setCurrentCheckPoint }: {setStatusHike: React.Dispatch<React.SetStateAction<string>> ; setCurrentCheckPoint: React.Dispatch<React.SetStateAction<Point | null>>}) {
    return <>
        <Button type="button" onClick={useCallback(() => { }, [])}> Select Checkpoint </Button>
        <Button type="button" color="red" onClick={useCallback(() => {setStatusHike('completed') }, [setStatusHike])}> Finish Activity </Button>
    </>
}

function DisplayReferencePoints({ points }: { points: Point[] }) {
    return <>{points.map((p) => PointMarker(p))}</>
}

function DisplayHuts({ huts }: { huts: withPoint<Hut>[] }) {
    return <>{huts.map((h) => PointMarker(h.point))}</>
}

export default ActivityPage;

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