import { Container, Paper, Title, Text, Space, Group, Stack, Box, Button, LoadingOverlay, Flex } from '@mantine/core';
import axios from 'axios';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import s from './ActivityPage.module.css';
import { MapContainer, TileLayer, useMap, Polyline, Marker } from 'react-leaflet'
import { UserContext } from '../../context/userContext';
import { useInterval } from '@mantine/hooks';
import { API } from '../../utilities/api/api';
import { Hike as HIKE, Hut, Point, UserHikes } from '../../generated/prisma-client';
import { extrackPoints } from '../../utilities/gpx';
import { withPoint } from '../../utilities/api/hikeApi';
import ErrorModal from '../../components/errorModal/errorModal';
import green from './marker-icon-green.png'
import L from 'leaflet';

const greenIcon = L.icon({
    iconUrl: green,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
})

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
    const { start } = useInterval(() => { setOffset((o) => o - 1) }, 16 * 2)
    const { state } = useContext(UserContext)
    const { loggedIn } = state

    const [selected, setSelected] = useState<number | null>(null)

    const navigate = useNavigate()


    useEffect(() => {
        if (!id) {
            setError('Invalid Activity')
            setLoading(false)
            return
        }
        if(!loggedIn) {
            setError('You need to be logged in to view this page')
            setLoading(false)
            return
        }
        const run = async () => {
            try {
                const activity = await API.hiker.getActivity(parseInt(id))
                if (!activity) return
                const hike = activity.hike

                setHike(activity.hike)
                setActivity(activity)
                
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

    }, [id, start, loading, loggedIn])

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
                                {useMemo(() =>
                                    <>
                                        <MapSetter center={center} />
                                        {
                                            [hike?.start_point && <PointMarker point={hike.start_point} />,
                                            hike?.end_point && <PointMarker point={hike.end_point} />]}
                                    </>
                                    , [hike?.start_point, hike?.end_point, center])}
                                {useMemo(() => <DisplayReferencePoints points={hike?.reference_points || []} action={setSelected} current={activity?.refPoint_id} />, [activity?.refPoint_id, hike?.reference_points])}
                                {useMemo(() => <DisplayHuts huts={hike?.huts || []} />, [hike?.huts])}
                            </MapContainer>
                        </Box>
                        <Box>
                            <Stack p={'md'}>
                                <>
                                    <Button disabled={!activity || activity.status !== "ongoing" || !selected} type="button" onClick={useCallback(() => {
                                        setActivity((a) => {
                                            if (!a) return null
                                            if (!selected) return a
                                            return { ...a, refPoint_id: selected }
                                        })
                                    }, [selected])}> Select Checkpoint </Button>
                                    <Button disabled={activity?.status !== "ongoing"} type="button" color="red" onClick={useCallback(() => {
                                        setActivity((a) => {
                                            if (!a) return null
                                            return { ...a, status: "completed" }
                                        })
                                    }, [])}> Finish Activity </Button>
                                </>
                                <Text fw={700}>Current Checkpoint:</Text>
                                <>{selected || activity?.refPoint_id}</>
                                <Text fw={700}>Current Status Hike:</Text>
                                <>{activity?.status}</>
                            </Stack>
                        </Box>
                    </Flex>

                    <Space h={'md'} />
                    <Flex direction={{ base: 'column', sm: 'row' }} gap={{ base: 'sm', sm: 'lg' }} justify={{ sm: 'center' }}>
                        <Button size="md" onClick={useCallback(async () => {
                            try {
                                id && activity && await API.hiker.updateActivity(id, activity.refPoint_id, activity.status)
                            } catch (e) {
                                setError('Error while updating activity')
                            }
                        }, [id, activity])}>Save</Button>
                        <Button size="md" color="red" onClick={useCallback(() => { navigate('/hikerarea') }, [navigate])}>Go back</Button>
                    </Flex>
                </Paper>
                <Space h={'md'} />

            </Container>
        </>
    );
};


function DisplayReferencePoints({ points, action, current }: { points: Point[], action: Function, current?: number }) {
    return <>{points.map((p) => <PointMarker point={p} key={p.id} clickEvent={action(p.id)} icon={current === p.id ? greenIcon : undefined} />)}</>
}

function DisplayHuts({ huts }: { huts: withPoint<Hut>[] }) {
    return <>{huts.map((h) => <PointMarker key={h.id} point={h.point} />)}</>
}

export default ActivityPage;

function PointMarker({ point, clickEvent, icon }: { point: Point, clickEvent?: () => void, icon?: L.Icon }) {
    if (!point.latitude || !point.longitude) return null
    return <Marker key={point.id}
        position={[point.latitude, point.longitude]}
        eventHandlers={{
            click: clickEvent || (() => { })
        }}
        icon={icon || new L.Icon.Default()}
    >
        {/* <Popup>
            {point.label}
        </Popup> */}
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
