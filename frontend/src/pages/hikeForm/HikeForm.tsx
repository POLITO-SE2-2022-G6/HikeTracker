import { Box, Button, Container, CSSObject, FileInput, Flex, Group, NumberInput, Paper, Space, Stack, Tabs, Textarea, TextInput, Title } from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import { IconUpload } from '@tabler/icons';
import axios from 'axios';
import L, { divIcon } from 'leaflet';
import { useCallback, useEffect, useState } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import { Link, NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import { Hut, ParkingLot, Point } from '../../generated/prisma-client';
import { API } from '../../utilities/api/api';
import s from './HikeForm.module.css';
import { fullHike } from '../../utilities/api/hikeApi';
import { extrackPoints } from '../../utilities/gpx';
import { MapSetter } from '../hike/HikeDetailPage';
import cabin from './cabin.svg';
import car from './car.svg';
import ErrorModal from '../../components/errorModal/errorModal';

const hutIcon = divIcon({
  html: cabin
})

type editArray = {
  created: Point[],
  deleted: number[],
}

type Points = Point & {
  hut?: Hut
  parkinglot?: ParkingLot
}

type Fields = {
  title?: string;
  length?: number;
  expected_time?: number;
  ascent?: number;
  difficulty?: number;
  startpointid?: number;
  endpointid?: number;
  description?: string;
  gpstrack?: File;
  reference_points?: editArray
  huts?: {
    created: number[],
    deleted: number[]
  };
}


const HikeForm: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate();
  const [hike, setHike] = useState<fullHike | null>(null)
  const [error, setError] = useState('');
  const [track, setTrack] = useState<[number, number][]>([])
  const [center, setCenter] = useState<[number, number]>([41.8, 12.4])
  const [settingRP] = useState(true)
  const [activeTab, setActiveTab] = useState<string | null>('ends');
  const [referencePointsEdit, setReferencePointsEdit] = useState<editArray>({ created: [], deleted: [] })
  const [newReferencePoint, setNewReferencePoint] = useState<Point>()
  const [load, setLoad] = useState(true)
  const [points, setPoints] = useState<Points[]>([])
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null)
  const [hutsEdit, setHutsEdit] = useState<{ created: number[], deleted: number[] }>({ created: [], deleted: [] })


  const form = useForm<Fields>({
    initialValues: {
      title: '',
      length: undefined,
      expected_time: undefined,
      ascent: undefined,
      difficulty: undefined,
      startpointid: undefined,
      endpointid: undefined,
      description: '',
      gpstrack: undefined,
      huts: {
        created: [],
        deleted: []
      },
    },

    validate: {
      title: (value: string) => (!value ? 'Title must not be empty' : null),
      length: (value: number) => (!value ? 'Length must not be empty' : null),
      expected_time: (value: number) => (!value ? 'Expected time must not be empty' : null),
      ascent: (value: number) => (!value ? 'Ascent must not be empty' : null),
      difficulty: (value: number) => (!value ? 'Difficulty must not be empty' : null),
      description: (value: string) => (!value ? 'Description must not be empty' : null),
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (load === true) {
          setLoad(false)
          setPoints(await API.point.getPoints() as Points[])
          if (id) {
            const hike = await API.hike.getHike(parseInt(id))
            if (!hike) return
            setHike(hike)
            form.setValues({
              title: hike.title,
              length: hike.length,
              expected_time: hike.expected_time,
              ascent: hike.ascent,
              difficulty: hike.difficulty,
              description: hike.description!,
            })

            if (hike.gpstrack) {
              const xml = await axios.get(`http://localhost:3001/` + hike.gpstrack, { withCredentials: true })
              const points = extrackPoints(xml.data)
              setTrack(points)
              setCenter(points[0])
            }
          }
        }
      } catch (e: any) {
        setError(e.message)
      }
    }
    fetchData();

  }, [load, form, id])

  useEffect(() => {
    if (form.values.gpstrack) {
      form.values.gpstrack.text().then(content => {
        const data = extrackPoints(content)
        setCenter(data[0])
        setTrack(data)
      }

      )
    }
  }, [form.values.gpstrack])



  return (
    <Container>
      <ErrorModal error={error} setError={setError} />
      <Title align="center">
        {id ? 'Edit a hike' : 'Add a New Hike'}
      </Title>
      <Container sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-start"
      } as CSSObject}>
        <Paper withBorder shadow={'md'} p={'md'} m={'md'} radius={'md'} sx={{
          flexGrow: 1,
          flexShrink: 0,
        } as CSSObject}>
          <form onSubmit={form.onSubmit(async (values) => await handleSubmit(id, values, setError, referencePointsEdit, hutsEdit, navigate))}>
            <TextInput
              label="Title"
              placeholder="Title of the hike"
              {...form.getInputProps('title')} />
            <Textarea
              label="Description"
              placeholder="Description of the hike"
              {...form.getInputProps('description')} />
            <NumberInput
              label="Length"
              description="In meters"
              precision={1}
              step={0.5}
              placeholder="2"
              min={1}
              {...form.getInputProps('length')} />
            <NumberInput
              label="Expected Time"
              placeholder="10"
              min={1}
              {...form.getInputProps('expected_time')} />
            <NumberInput
              label="Ascent"
              description="In meters"
              precision={1}
              step={0.5}
              placeholder="Ascent of the hike"
              {...form.getInputProps('ascent')}
            />
            <NumberInput
              label="Difficulty"
              placeholder="0"
              min={0}
              max={4}
              {...form.getInputProps('difficulty')} />
            <FileInput
              label="Gps Track"
              placeholder=""
              accept=".gpx"
              icon={<IconUpload size={14} />}
              {...form.getInputProps('gpstrack')}
            />

            <TextInput
              hidden
              {...form.getInputProps('startpointid')}
            />
            <TextInput
              hidden
              {...form.getInputProps('endpointid')}
            />
            <TextInput
              hidden
              {...form.getInputProps('huts')}
            />

            <Space h={'md'} />
            <Tabs value={activeTab} onTabChange={setActiveTab} mb="md" >
              <Tabs.List grow>
                <Tabs.Tab value="ends">Start & End points</Tabs.Tab>
                <Tabs.Tab value="reference">Reference Points</Tabs.Tab>
                <Tabs.Tab value="huts">Huts</Tabs.Tab>
              </Tabs.List>
            </Tabs>


            <Flex wrap="wrap">
              <Box h={'400px'} style={{
                flexGrow: 1,
                minWidth: '400px',
              }}>
                <MapContainer center={[41.90, 12.49]} zoom={8} className={s.map}>
                  <DisplayTrack track={track} />

                  {activeTab === 'ends' && <DisplayHutsAndParkinglots points={points} />}
                  {activeTab === 'reference' && [<DisplayReferencePoints key="RPS" hike={hike} referencePointsEdit={referencePointsEdit} />, <ReferencePointClicker key="RPC" settingRP={settingRP} newReferencePoint={newReferencePoint} setNewReferencePoint={setNewReferencePoint} track={track} />]}
                  {(activeTab === 'huts' || activeTab === 'ends') && [<DisplayOwnHuts key="ownH" hike={hike} setSelectedMarker={setSelectedMarker} />, <DisplayHuts key="aH" points={points} />]}

                  <MapSetter center={center} />

                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </MapContainer>
              </Box>
              <Box>
                <Stack p={'md'}>
                  {activeTab === 'ends' && <EndsButtons selectedMarker={selectedMarker} form={form} />}
                  {activeTab === 'reference' && <ReferenceButtons newReferencePoint={newReferencePoint} selectedMarker={selectedMarker} setReferencePointsEdit={setReferencePointsEdit} />}
                  {activeTab === 'huts' && <HutsButtons selectedMarker={selectedMarker} setHutsEdit={setHutsEdit} />}
                </Stack>
              </Box>
            </Flex>

            <Group position="center">
              <Button mt="xl" type='submit'>Save</Button>
              <Link to="/hikelist">
                <Button type="button" mt="xl" color="red">Cancel</Button>
              </Link>
            </Group>

          </form>
        </Paper>
      </Container>
    </Container >
  )
}


function EndsButtons({ selectedMarker, form }: { selectedMarker: number | null; form: UseFormReturnType<Fields, (values: Fields) => Fields> }) {
  return <>
    <Button type="button" onClick={useCallback(() => { selectedMarker && form.setValues({ startpointid: selectedMarker }) }, [selectedMarker, form])}> Set as Start Point </Button>
    <Button type="button" onClick={useCallback(() => { selectedMarker && form.setValues({ endpointid: selectedMarker }) }, [selectedMarker, form])}> Set as End Point </Button>
  </>
}

function ReferenceButtons({ newReferencePoint, selectedMarker, setReferencePointsEdit }: { newReferencePoint: Point | undefined, selectedMarker: number | null, setReferencePointsEdit: React.Dispatch<React.SetStateAction<editArray>> }) {
  return <>
    <Button type="button" onClick={useCallback(() => { newReferencePoint && setReferencePointsEdit(current => ({ ...current, created: [...current.created, newReferencePoint] })) }, [newReferencePoint, setReferencePointsEdit])}> Add Point </Button>
    <Button type="button" onClick={useCallback(() => { selectedMarker && selectedMarker !== -1 && setReferencePointsEdit(current => ({ ...current, deleted: [...current.deleted, selectedMarker] })) }, [selectedMarker, setReferencePointsEdit])}> Remove Point</Button>
  </>
}

function HutsButtons({ selectedMarker, setHutsEdit }: {
  selectedMarker: number | null, setHutsEdit: React.Dispatch<React.SetStateAction<{
    created: number[];
    deleted: number[];
  }>>
}) {
  return <>
    <Button type="button" onClick={useCallback(() => { selectedMarker && setHutsEdit(current => ({ ...current, created: [...current.created, selectedMarker] })) }, [selectedMarker, setHutsEdit])}> Link Hut </Button>
    <Button type="button" onClick={useCallback(() => { selectedMarker && setHutsEdit(current => ({ ...current, deleted: [...current.deleted, selectedMarker] })) }, [selectedMarker, setHutsEdit])}> Remove Hut </Button>
  </>
}

const handleSubmit = async (id: string | undefined, values: Fields, setError: React.Dispatch<React.SetStateAction<string>>, referencePointsEdit: editArray, hutsEdit: { created: number[]; deleted: number[]; }, navigate: NavigateFunction) => {
  try {
    if (id) {
      // Edit hike
      const intId = parseInt(id);
      if (!intId) {
        setError("Error while parsing hike's id: not a number")
        return
      }
      await API.hike.updateHike(intId, {
        ...values,
        reference_points: JSON.stringify({
          created: referencePointsEdit.created.map(e => {
            return {
              latitude: e.latitude,
              longitude: e.longitude,
            }
          }),
          deleted: referencePointsEdit.deleted
        }),
        huts: JSON.stringify(hutsEdit)
      })
      navigate('/hike/' + id)
    } else {

      await API.hike.createHike({
        ...values,
        reference_points: JSON.stringify(referencePointsEdit),
        huts: JSON.stringify(hutsEdit)
      })
      navigate('/hikelist');
    }
  } catch (error:any) {
    setError(id ? "Error while editing hike: " + error : "Error while creating hike: " + error.message);
  }
}

function DisplayOwnHuts({ hike, setSelectedMarker }: { hike: fullHike | null; setSelectedMarker: React.Dispatch<React.SetStateAction<number | null>> }) {
  if (!hike || !hike.huts) return (<></>)
  return <>
    {hike.huts.map((hut) => {
      return <Marker
        key={hut.id}
        position={[hut.point.latitude!, hut.point.longitude!]}
        icon={hutIcon}
        eventHandlers={{
          click: () => {
            setSelectedMarker(hut.id)
          }
        }}
      />
    })}
  </>
}

function DisplayReferencePoints({ hike, referencePointsEdit }: { hike: (fullHike | null); referencePointsEdit: editArray }) {
  if (!hike || !hike.reference_points) return (<></>)

  const toDisplay = [...hike.reference_points, ...referencePointsEdit.created]
    .filter(p => p.id ? !referencePointsEdit.deleted.includes(p.id) : true);
  return <>
    {
      toDisplay
        .map((point) => {
          return <DisplayPoint point={point} key={point.id} />
        })}
  </>
}

function DisplayHuts({ points }: { points: Points[] }) {
  return <>
    {points.map((point) => {
      if (point.hut) return <DisplayPoint point={point} key={point.id} />
      return null;
    })}
  </>
}

function DisplayHutsAndParkinglots({ points }: { points: Points[] }) {
  console.log(points)
  return <>
    {points.map((point) => {
      if (point.hut || point.parkinglot) return <DisplayPoint point={point} key={point.id} />
      return null;
    })}
  </>
}

function DisplayPoint(props: { point: Points }, setSelectedMarker: React.Dispatch<React.SetStateAction<number | null>>) {
  const { point } = props
  let icon = new L.Icon.Default()

  if (point.hut)
    icon = L.icon({ iconUrl: cabin })
  else if (point.parkinglot)
    icon = L.icon({ iconUrl: car })


  return <Marker
    key={point.id}
    position={[point.latitude!, point.longitude!]}
    icon={icon}
    eventHandlers={{
      click: () => {
        setSelectedMarker(point.id);
      }
    }}

  >
    <Popup>
      {point.label}
    </Popup>
  </Marker>;
}

function ReferencePointClicker({ settingRP, newReferencePoint, setNewReferencePoint, track }: { settingRP: boolean, newReferencePoint: Point | undefined, setNewReferencePoint: React.Dispatch<React.SetStateAction<Points | undefined>>, track: [number, number][] }) {
  useMapEvents({
    click: (e) => {
      if (!settingRP || !track) return
      // find closes coordinates belonging to the track to the clicked position
      const closest = track.reduce((prev, curr) => {
        const prevDistance = distance([prev[0], prev[1]], [e.latlng.lat, e.latlng.lng])
        const currDistance = distance([curr[0], curr[1]], [e.latlng.lat, e.latlng.lng])
        return (prevDistance < currDistance) ? prev : curr
      })
      //console.log("closest", closest)
      setNewReferencePoint({
        id: -1,
        latitude: closest[0],
        longitude: closest[1],
        label: 'New Reference Point',
        elevation: 0,
        city: '',
        region: '',
        province: '',
      })
    }
  })

  if (newReferencePoint?.latitude && newReferencePoint?.longitude)
    return <Marker position={{ lat: newReferencePoint.latitude, lng: newReferencePoint.longitude }} />

  return null
}

function distance(a: [number, number], b: [number, number]) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2))
}

function DisplayTrack({ track }: { track: [number, number][] }) {
  if (!track) return (<></>)

  return <Polyline
    positions={track}
  />
}

export default HikeForm;
